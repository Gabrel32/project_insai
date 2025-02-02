import Layout from '../componets/Layout'
import Form from '../componets/Form';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';


export default function Login() {
  const navigate = useNavigate()
  const fieldsConfig = [
    {
        name: "email",
        label: "Correo Electrónico:",
        type: "email",
        placeholder: "Ingresa tu correo",
      
    },
    {
        name: "password",
        label: "Contraseña:",
        type: "password",
        placeholder: "Ingresa tu contraseña",
        
    },
];

const handleFormSubmit = async (data) => {
      const {password, email } = data;
  
      // Validaciones
      if (!email || !password) {
        return toast.error("Todos los campos son obligatorios");
      }
  
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return toast.error("El correo electrónico no es válido");
      }

    if (password.length < 8) {
      return toast.error("La contraseña debe tener minimo 8 digitos");
      }

      // Crear el objeto de usuario
          const userData = {
            correo:email,
            password
          };
          
      
          try {
            // Enviar la petición POST al backend
            const response = await fetch(`${import.meta.env.VITE_FRONT_URI}/login`, {
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
            toast.success(result?.message);
            setTimeout(() => {
              navigate("/Home");
            }, 4000);  
          } catch (error) {
            console.error("Error en el registro:", error);
            toast.error(error.message || "Error en el registro. Inténtalo de nuevo.");
          }
};

  return (
    <>
      <Layout>
        <div className='contentForm'>
          <Form styleForm={"form formLogin"} fields={fieldsConfig} onSubmit={handleFormSubmit} buttonText="Ingresar" />

        </div>

      </Layout> 
    </>
  )
}
