import Layout from '../componets/Layout'
import Form from '../componets/Form';

export default function Login() {
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

const handleFormSubmit = (data) => {
    console.log("Datos enviados:", data);
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
