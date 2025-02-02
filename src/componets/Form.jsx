import React from 'react';

export default function Form({ fields, onSubmit, buttonText = "Enviar", styleForm }) {
    const [formData, setFormData] = React.useState(
        fields.reduce((acc, field) => {
            acc[field.name] = field.value || ""; // Inicializa con valores predeterminados
            return acc;
        }, {})
    );

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData); // Envía los datos al padre o a una función específica
    };

    return (
        <form onSubmit={handleSubmit} className={styleForm}>
            {fields.map((field, i) => (
                <div key={field.name + i} className={field.wrapperClass || "input-container"}>
                    <input
                        type={field.type || "text"}
                        id={field.id || field.name}
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleChange}
                        className={field.inputClass || ""}
                        placeholder=" " // Placeholder vacío para activar el efecto
                        maxLength={field.maxLength??undefined} // Limita la cantidad de caracteres
                        // required // Puedes agregar required si es necesario
                    />
                    <label htmlFor={field.name} className={field.labelClass || ""}>
                        {field.label}
                    </label>
                </div>
            ))}
            <button type="submit" className="submit-button EfectButton">
                {buttonText}
            </button>
        </form>
    );
}