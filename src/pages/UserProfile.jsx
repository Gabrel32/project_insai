import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../componets/Layout";
import Form from "../componets/Form";
import { formatToDescriptiveDateTime } from "../utils/utils";
import { toast } from "react-toastify";
import jsPDF from "jspdf";

const UserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenDR, setIsModalOpenDR] = useState(false);
  const [isModalOpenDRGuia, setIsModalOpenDRGuia] = useState(false); // Estado para el segundo modal
  const [fieldsConfig, setFieldsConfig] = useState([]);
  const [fieldsConfigDR, setFieldsConfigDR] = useState([ // Configuración del formulario del segundo modal
    {
      name: "declaracionReses",
      label: "Declaración de reses vacunadas:",
      type: "number",
      placeholder: "Ingresa la cantidad de reses vacunadas",
      value: "",
    },
  ]);
  const [fieldsConfigDRGuia, setFieldsConfigDRGuia] = useState([ // Configuración del formulario del segundo modal
    {
      name: "Guia_Pdf",
      label: "Ingrese la cantidad de reses",
      type: "number",
      placeholder: "Ingrese la cantidad de reses",
      value: "",
    },
  ]);
  const [UpDeclaration, setUpDeclaration] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [user, declaration] = await Promise.all([
          consultUser(id),
          consultDeclaration(id)
        ]);
        
        setUserData(user);
        setUpDeclaration(declaration);
      } catch (error) {
        console.error("Error al cargar datos:", error);
        toast.error("Error cargando información");
      }
    };
  
    fetchData();
  }, [id]);

  // Actualizar fieldsConfig cuando userData cambie
  useEffect(() => {
    if (userData) {
      setFieldsConfig(createFieldsConfig(userData)); // Regenera fieldsConfig
    }
  }, [userData]); // Dependencia correcta: [userData]

  // Función para consultar al usuario
  async function consultUser(idU) {
    const response = await fetch(`${import.meta.env.VITE_FRONT_URI}/users/search?term=${idU}`);
    const data = await response.json();
    return data[0];
  }

  async function consultDeclaration(idU) {
    const response = await fetch(`${import.meta.env.VITE_FRONT_URI}/users/${idU}/res-en-declaracion`);
    const data = await response.json();
    // Asegurar que siempre retorne el último registro
    return Array.isArray(data) ? data[data.length - 1] : data;
  }

  // Función para crear la configuración de campos del formulario
  const createFieldsConfig = (data) => [
    {
      name: "nombre",
      label: "Nombre:",
      type: "text",
      placeholder: "Ingresa el nombre",
      value: data.nombre,
    },
    {
      name: "apellido",
      label: "Apellido:",
      type: "text",
      placeholder: "Ingresa el apellido",
      value: data.apellido,
    },
    {
      name: "cedula",
      label: "Cédula:",
      type: "number",
      placeholder: "Ingresa la cédula",
      value: data.cedula,
    },
    {
      name: "finca",
      label: "Finca:",
      type: "text",
      placeholder: "Ingresa la finca",
      value: data.finca,
    },
    {
      name: "email",
      label: "Correo Electrónico:",
      type: "email",
      placeholder: "Ingresa tu correo",
      value: data.correo,
    },
    {
      name: "telefono",
      label: "Teléfono:",
      type: "number",
      placeholder: "Ingresa el teléfono",
      maxLength: 11,
      value: data.telefono,
    },
  ];

  // Función para manejar el envío del formulario
  const handleFormSubmit = async (data) => {
    const { nombre, apellido, cedula, email, finca, telefono } = data;

    // Validaciones
    if (!nombre || !apellido || !cedula || !email || !finca || !telefono) {
      return toast.error("Todos los campos son obligatorios");
    }

    if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(nombre)) {
      return toast.error("El nombre solo puede contener letras");
    }

    if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(apellido)) {
      return toast.error("El apellido solo puede contener letras");
    }

    if (cedula.length < 7 || cedula.length > 10) {
      return toast.error("La cédula debe tener entre 7 y 10 dígitos");
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return toast.error("El correo electrónico no es válido");
    }

    if (!/^04(12|24|14|16)\d{7}$/.test(telefono)) {
      return toast.error(
        "El número de teléfono debe comenzar con '04' y seguir con '12', '24', '14' o '16', seguido de 7 dígitos."
      );
    }

    const updatedUserData = {
      nombre,
      apellido,
      cedula,
      correo: email,
      finca,
      telefono,
      resEnDeclaracion: [],
    };

    try {
      const response = await fetch(`http://localhost:3000/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUserData),
      });

      // Si la respuesta está vacía (ej. 204 No Content)
      if (response.status === 204) {
        setUserData((prev) => ({
          ...prev,
          ...updatedUserData,
          updatedAt: new Date().toISOString(),
        }));
        setIsModalOpen(false);
        toast.success("Usuario actualizado exitosamente");
        return;
      }

      // Si hay contenido, verifica que sea JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("La respuesta del servidor no es JSON");
      }

      const result = await response.json();
      setUserData(result.user); // Actualiza userData con la respuesta del servidor
      setIsModalOpen(false);
      toast.success("Usuario actualizado exitosamente");
    } catch (error) {
      console.error("Error en la actualización:", error);
      toast.error(error.message || "Error en la actualización");
    }
  };

  // Función para manejar el envío del formulario de declaración de reses
  const handleResDeclaration = async (data) => {
    const { declaracionReses } = data;
  
    if (!declaracionReses || declaracionReses < 0) {
      return toast.error("La cantidad de reses vacunadas no es válida");
    }
  
    try {
      const response = await fetch(`${import.meta.env.VITE_FRONT_URI}/users/${id}/res-en-declaracion`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cabezasVAC: declaracionReses }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al generar la declaración");
      }
  
      // Actualización adicional para refrescar los datos
      const [updatedUser, updatedDeclaration] = await Promise.all([
        consultUser(id),
        consultDeclaration(id)
      ]);
      
      setUserData(updatedUser);
      setUpDeclaration(updatedDeclaration);
      
      setIsModalOpenDR(false);
      toast.success("Declaración de reses generada exitosamente");
    } catch (error) {
      console.error("Error en la declaración de reses:", error);
      toast.error(error.message || "Error en la declaración de reses");
    }
  };

  const handleResDeclarationGuia = async (data) => {
    try {

        if (UpDeclaration.error) {
            toast.error("Declara primero tus reses, antes de generar la guia");
            return;
        }
        
      if (!userData || !data?.Guia_Pdf) {
        toast.error("Datos incompletos para generar la guía");
        return;
      }

      if (data?.Guia_Pdf > UpDeclaration?.cabezasVAC ) {
        toast.error("Las reses declaradas en la guia superan la declaracion de vacunas");
        return;
      }

  
      const fechaGeneracion = new Date().toLocaleString("es-VE", {
        timeZone: "America/Caracas",
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
  
      const doc = new jsPDF();
      const colores = {
        verdeFondo: [234, 245, 234],
        verdeOscuro: [56, 102, 65],
        marronClaro: [191, 161, 129],
        marronOscuro: [102, 73, 41],
        acento: [223, 177, 91]
      };
  
      // Configuración inicial de página
      doc.setFillColor(...colores.verdeFondo);
      doc.rect(0, 0, 210, 297, 'F');
  
      // Encabezado estilizado
      doc.setFillColor(...colores.verdeOscuro);
      doc.rect(0, 0, 210, 40, 'F');
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(255, 255, 255);
      doc.text("DECLARACIÓN GANADERA", 105, 28, { align: "center" });
  
      // Cinta decorativa
      doc.setFillColor(...colores.acento);
      doc.rect(0, 42, 210, 8, 'F');
  
      // Sección principal con efecto de "papel"
      doc.setDrawColor(...colores.marronClaro);
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(15, 60, 180, 200, 3, 3, 'FD');
      
      // Contenido interno
      let y = 70;
      const estiloEtiqueta = {
        font: "helvetica",
        style: "bold",
        size: 12,
        color: colores.marronOscuro
      };
      
      const estiloValor = {
        font: "helvetica",
        style: "normal",
        size: 12,
        color: [70, 70, 70]
      };
  
      // Función para añadir filas estilizadas
      const addRow = (label, value, offset = 15) => {
        doc.setFont(estiloEtiqueta.font, estiloEtiqueta.style);
        doc.setFontSize(estiloEtiqueta.size);
        doc.setTextColor(...estiloEtiqueta.color);
        doc.text(label, offset, y);
        
        doc.setFont(estiloValor.font, estiloValor.style);
        doc.setFontSize(estiloValor.size);
        doc.setTextColor(...estiloValor.color);
        doc.text(value, offset + 45, y);
        
        y += 8;
      };
  
      // Datos del productor en dos columnas
      doc.setFontSize(14);
      doc.setTextColor(...colores.verdeOscuro);
      doc.text("INFORMACIÓN DEL PRODUCTOR", 20, 65);
      
      y = 80;
      addRow("Nombre:", `${userData.nombre} ${userData.apellido}`, 20);
      addRow("Cédula:", userData.cedula, 20);
      addRow("Finca:", userData.finca, 20);
      
      y += 5;
      addRow("Email:", userData.correo, 20);
      addRow("Teléfono:", userData.telefono, 20);
  
      // Separador decorativo
      doc.setDrawColor(...colores.acento);
      doc.setLineWidth(0.5);
      doc.line(20, y + 5, 190, y + 5);
      y += 15;
  
      // Sección de reses con badge moderno
      doc.setFillColor(...colores.verdeOscuro);
      doc.roundedRect(20, y, 60, 12, 3, 3, 'F');
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(255, 255, 255);
      doc.text("RESES DECLARADAS", 25, y + 8);
  
      y += 20;
      doc.setFontSize(36);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...colores.acento);
      doc.text(data.Guia_Pdf, 105, y, { align: "center" });
      
      doc.setFontSize(14);
      doc.setTextColor(...colores.marronOscuro);
      doc.text("cabezas de ganado", 105, y + 10, { align: "center" });
  
      // Pie de página con diseño moderno
      doc.setFillColor(...colores.verdeOscuro);
      doc.rect(0, 260, 210, 37, 'F');
      doc.setFontSize(10);
      doc.setTextColor(255, 255, 255);
      doc.text("Documento generado electrónicamente", 20, 270);
      doc.text(`Fecha de emisión: ${fechaGeneracion}`, 20, 275);
      doc.text("Sistema de Gestión Ganadera", 160, 275, { align: "right" });
  
      // Borde decorativo final
      doc.setDrawColor(...colores.acento);
      doc.setLineWidth(1);
      doc.rect(5, 5, 200, 287);
  
      doc.save("declaracion-ganadera.pdf");
    } catch (error) {
      console.error("Error al generar el PDF:", error);
      toast.error("Error al generar la guía");
    }
  };



  // Renderizar mensaje de carga si userData es null
  if (!userData) {
    return (
      <Layout>
        <div className="user-profile">
          <p>Cargando datos del usuario...</p>
        </div>
      </Layout>
    );
  }

  // Renderizar el componente
  return (
    <Layout>
      <div className="user-profile">
        <h1>
          {userData.nombre} {userData.apellido}
        </h1>

        <div className="user-details">
          <p>
            <strong>ID:</strong> {id}
          </p>
          <p>
            <strong>Registrado:</strong>{" "}
            {userData.updatedAt
              ? formatToDescriptiveDateTime(userData.updatedAt)
              : "Fecha no disponible"}
          </p>
          <p>
            <strong>Cédula:</strong> {userData.cedula}
          </p>
          <p>
            <strong>Correo:</strong> {userData.correo}
          </p>
          <p>
            <strong>Finca:</strong> {userData.finca}
          </p>
          <p>
            <strong>Teléfono:</strong> {userData.telefono}
          </p>
        </div>

        <div className="contentButton">
        <button onClick={() => setIsModalOpenDRGuia(true)} className="EfectButton ">
            Generar Guia
          </button>
          <button onClick={() => navigate(-1)} className="EfectButton back-button">
            Volver
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="EditarButton EfectButton"
          >
            Editar
          </button>
          <button
            onClick={() => setIsModalOpenDR(true)} // Abre el segundo modal
            className="ELiminarButton EfectButton"
          >
            Generar DR
          </button>
          
        </div>
      </div>

    <div className="user-DR">
        <h2>Ultima Declaracion</h2>
      {UpDeclaration.cabezasVAC ? (
        <>
        <p>
        <strong>Declaración:</strong> {UpDeclaration.cabezasVAC} reses vacunadas
        </p>
        <p>
        <strong>Fecha:</strong> {formatToDescriptiveDateTime(UpDeclaration.updateapt)}
        </p>
        </>
      ) : (
        <div>No tiene declaraciones</div>
      )}
    </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              onClick={() => setIsModalOpen(false)}
              className="close-modal-button EfectButton"
            >
              x
            </button>
            <Form
              styleForm={"form formLogin"}
              fields={fieldsConfig}
              onSubmit={handleFormSubmit}
              buttonText="Actualizar"
              initialValues={fieldsConfig}
            />
          </div>
        </div>
      )}

      {isModalOpenDR && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              onClick={() => setIsModalOpenDR(false)} // Cierra el segundo modal
              className="close-modal-button EfectButton"
            >
              x
            </button>
            <Form
              styleForm={"form formLogin"}
              fields={fieldsConfigDR}
              onSubmit={handleResDeclaration}
              buttonText="Generar DR"
              initialValues={fieldsConfigDR}
            />
          </div>
        </div>
      )}

      
        {isModalOpenDRGuia && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              onClick={() => setIsModalOpenDRGuia(false)} // Cierra el segundo modal
              className="close-modal-button EfectButton"
            >
              x
            </button>
            <Form
              styleForm={"form formLogin"}
              fields={fieldsConfigDRGuia}
              onSubmit={handleResDeclarationGuia}
              buttonText="Generar Guia Pdf"
              initialValues={fieldsConfigDRGuia}
            />
          </div>
        </div>
      )}
    </Layout>
  );
};

export default UserProfile;