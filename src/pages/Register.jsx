import Layout from "../componets/Layout"
import Form from "../componets/Form";
import { toast } from "react-toastify";
export default function Register() {

  const fieldsConfig = [
      {
        name: "nombre",
        label: "Nombre:",
        type: "text",
        placeholder: "ingresa el nombre",
      },
      {
        name: "apellido",
        label: "Apellido:",
        type: "text",
        placeholder: "ingresa el apellido",
      },
      {
        name: "cedula",
        label: "cedula:",
        type: "text",
        placeholder: "ingresa la cedula",
      },
      {
        name: "finca",
        label: "finca:",
        type: "text",
        placeholder: "ingresa la finca",
      },
      {
        name: "email",
        label: "Correo Electrónico:",
        type: "email",
        placeholder: "Ingresa tu correo",
      },
      {
        name: "telefono",
        label: "telefono:",
        type: "Number",
        placeholder: "ingresa el telefono",
        maxLength: 20, // Limita a 20 caracteres

      },
      
];

const handleFormSubmit = (data) => {
  const { nombre, apellido, cedula, email, finca, telefono } = data;

  if (
    !nombre &&
    !telefono &&
    !apellido &&
    !cedula &&
    !email &&
    !finca
  ) {
    return toast.error("Te falta llenar todos los campos");
  }
  else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(nombre)) {
    return toast.error("El nombre solo puede contener letras");
  }
  
  else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(apellido)) {
    return toast.error("El apellido solo puede contener letras");
  }

  else if (cedula.length < 7 || cedula.length > 10) {
    return toast.error("La cédula debe tener entre 7 y 10 dígitos");
  }

  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return toast.error("El correo electrónico no es válido");
  }

  else if (!/^04(12|24|14|16)\d{7}$/.test(telefono)) {
    return toast.error("El número de teléfono debe comenzar con '04' y seguir con '12', '24', '14' o '16', seguido de 7 dígitos.");
  }

  

  
}


  return (
    <Layout>
        <div className='contentForm'>
          <Form styleForm={"form formLogin"} fields={fieldsConfig} onSubmit={handleFormSubmit} buttonText="Ingresar" />
          
          <button className="button-wave"> <a href="/Home">volver ala pagina pricipal</a> </button>
        </div>
    </Layout> 
  )
}




 
  
