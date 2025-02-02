const formatToDescriptiveDateTime = (date) => {
    // Si la fecha es una cadena, convertirla a un objeto Date
    if (typeof date === "string") {
      date = new Date(date);
    }
  
    // Verificar si la fecha es válida
    if (isNaN(date.getTime())) {
      throw new Error("Fecha no válida");
    }
  
    // Nombres de los meses en español
    const months = [
      "enero", "febrero", "marzo", "abril", "mayo", "junio",
      "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
    ];
  
    // Obtener los componentes de la fecha
    const day = date.getDate(); // Día (sin ceros iniciales)
    const month = months[date.getMonth()]; // Nombre del mes
    const year = date.getFullYear(); // Año (4 dígitos)
    let hours = date.getHours(); // Horas (formato 24h)
    const minutes = String(date.getMinutes()).padStart(2, "0"); // Minutos (2 dígitos)
  
    // Convertir a formato 12h y determinar si es AM o PM
    const period = hours >= 12 ? "pm" : "am";
    hours = hours % 12 || 12; // Convertir 0 a 12 para formato 12h
  
    // Formatear la fecha y hora en el formato descriptivo
    return `${day} de ${month} de ${year} a las ${hours}:${minutes} ${period}`;
  };

  export {formatToDescriptiveDateTime}