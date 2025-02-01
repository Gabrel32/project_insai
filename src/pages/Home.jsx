import Layout from "../componets/Layout"
import { useState,useEffect } from "react";
import Card from "../componets/Cart";

export default function Home() {
  const [vacunas, setVacunas] = useState([]); // Variable para almacenar los datos
  useEffect(() => {
    // Función para realizar la petición GET
    const fetchVacunas = async () => {
        try {
            const response = await fetch('http://localhost:3000/vacunas'); // URL del endpoint
            if (!response.ok) {
                throw new Error('Error al obtener las vacunas');
            }
            const data = await response.json(); // Convertir la respuesta a JSON
            setVacunas(data); // Llenar la variable con los datos obtenidos
        } catch (error) {
            console.error('Error en la petición:', error);
        }
    };
  
    fetchVacunas(); // Llamar a la función
  }, []); // Ejecutar solo una vez al montar el componente

  console.log(vacunas);


  return (
    <>
      <Layout>
          <div className="contentCarts">
            {vacunas.map((e,i)=>(
              <>
              <Card key={i+e._id} data={e}/>
              </>
              
            ))}
          </div>
      </Layout> 
    </>
  )
}
