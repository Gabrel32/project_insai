import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Importar useNavigate

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [visibleResults, setVisibleResults] = useState(5);
  const [hasSearched, setHasSearched] = useState(false);

  const navigate = useNavigate();

  const sendQueryToBackend = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`http://localhost:3000/users/search?term=${searchQuery}`);

      if (!response.ok) {
        throw new Error("Error al buscar");
      }

      const data = await response.json();
      setResults(data);
      setHasSearched(true);
    } catch (error) {
      console.error("Error en la búsqueda:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      sendQueryToBackend(query);
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [query]);

  const loadMoreResults = () => {
    setVisibleResults((prevVisibleResults) => prevVisibleResults + 5);
  };

  // Función para manejar el clic en un resultado
  const handleResultClick = (userData) => {
    navigate(`/users/${userData._id}`, { state: { userData } }); // Enviar la data del usuario
  };

  return (
    <div className="search-bar-container">
      <input
        type="text"
        placeholder="Buscar ganaderos aquí"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="search-input"
      />

      {isLoading ? (
        <p>Cargando...</p>
      ) : (
        <>
          {hasSearched && results.length === 0 ? (
            <p className="no-results-message result-item">No se encontraron resultados.</p>
          ) : (
            <>
              <ul className="results-list">
                {results.slice(0, visibleResults).map((result) => (
                  <li
                    key={result._id}
                    className="EfectButton result-item"
                    onClick={() => handleResultClick(result)} // Pasar toda la data del usuario
                    style={{ cursor: "pointer" }}
                  >
                    <p>
                      <strong>Nombre:</strong> {result.nombre} {result.apellido}{" "}
                      <strong>Cédula:</strong> {result.cedula}
                    </p>
                    <p>
                      <strong>Correo:</strong> {result.correo}
                    </p>
                    <p>
                      <strong>Finca:</strong> {result.finca}
                    </p>
                    <p>
                      <strong>Teléfono:</strong> {result.telefono}
                    </p>
                  </li>
                ))}
              </ul>

              {results.length > visibleResults && (
                <div className="load-more-container">
                  <button className="load-more-button EfectButton" onClick={loadMoreResults}>
                    Cargar más resultados
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default SearchBar;