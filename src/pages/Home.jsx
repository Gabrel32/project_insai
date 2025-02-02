import Layout from "../componets/Layout";
import { useState, useEffect } from "react";
import Card from "../componets/Cart";
import SearchBar from "../componets/SearchBar";

export default function Home() {
  const [vacunas, setVacunas] = useState([]); // Variable para almacenar los datos

  useEffect(() => {
    // Función para realizar la petición GET
    const fetchVacunas = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_FRONT_URI}/vacunas`); // URL del endpoint
        if (!response.ok) {
          throw new Error("Error al obtener las vacunas");
        }
        const data = await response.json(); // Convertir la respuesta a JSON
        setVacunas(data); // Llenar la variable con los datos obtenidos
      } catch (error) {
        console.error("Error en la petición:", error);
      }
    };

    fetchVacunas(); // Llamar a la función
  }, []); // Ejecutar solo una vez al montar el componente

  return (
    <>
      <Layout>
      <button className="button-wave">
          <a href="/Register">Registrar Ganaderos</a>
        </button>
          <SearchBar/>
        <div className="contentCarts">
          {vacunas.map((e) => (
            <Card key={e._id} data={e} /> // Usar e._id como clave única
          ))}
        </div>
      </Layout>
    </>
  );
}