import React from "react";
import Layout from "../componets/Layout";
import Form from "../componets/Form";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate(); // Hook para redireccionar

  const fieldsConfig = [
    {
      name: "nombre",
      label: "Nombre:",
      type: "text",
      placeholder: "Ingresa el nombre",
    },
    {
      name: "apellido",
      label: "Apellido:",
      type: "text",
      placeholder: "Ingresa el apellido",
    },
    {
      name: "cedula",
      label: "Cédula:",
      type: "number",
      placeholder: "Ingresa la cédula",
    },
    {
      name: "finca",
      label: "Finca:",
      type: "text",
      placeholder: "Ingresa la finca",
    },
    {
      name: "email",
      label: "Correo Electrónico:",
      type: "email",
      placeholder: "Ingresa tu correo",
    },
    {
      name: "telefono",
      label: "Teléfono:",
      type: "number",
      placeholder: "Ingresa el teléfono",
      maxLength: 11, // Limita a 11 caracteres
    },
  ];

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



    // Crear el objeto de usuario
    const userData = {
      nombre,
      apellido,
      cedula,
      correo:email,
      finca,
      telefono,
      resEnDeclaracion: []
    };
    console.log(JSON.stringify(userData));
    

    try {
      // Enviar la petición POST al backend
      const response = await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al registrar el usuario");
      }

      const result = await response.json();
      toast.success("Usuario registrado exitosamente");
      setTimeout(() => {
        navigate("/Home");
      }, 4000);  
    } catch (error) {
      console.error("Error en el registro:", error);
      toast.error(error.message || "Error en el registro. Inténtalo de nuevo.");
    }
  };

  return (
    <Layout>
      <div className="contentForm">
        <Form
          styleForm={"form formLogin"}
          fields={fieldsConfig}
          onSubmit={handleFormSubmit}
          buttonText="Registrar"
        />

        <button className="button-wave">
          <a href="/Home">Volver a la página principal</a>
        </button>
      </div>
    </Layout>
  );
}