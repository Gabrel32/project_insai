
const Card = ({ data }) => {
    return (
        <div className="card">
            <h3>{data.nombre_comun}</h3>
            <p><strong>Nombre Científico:</strong> {data.nombre_cientifico}</p>
            <p><strong>Inyección:</strong> {data.administracion}</p>
            <p><strong>Dosis:</strong> {data.dosis}</p>
        </div>
    );
};

export default Card;
