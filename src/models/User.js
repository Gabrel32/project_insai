// src/models/User.js
import mongoose from 'mongoose';

// Definición del esquema
const userSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
    },
    apellido: {
        type: String,
        required: true,
    },
    correo: {
        type: String,
        required: true,
        unique: true, // Asegura que el correo sea único
        match: /.+\@.+\..+/, // Validación básica de formato de correo
    },
    cedula: {
        type: String,
        required: true,
        unique: true, // Asegura que la cédula sea única
    },
    finca: {
        type: String,
        required: false, // Cambia a true si es obligatorio
    },
    telefono: {
        type: String,
        required: false, // Cambia a true si es obligatorio
        match: /^\d{11}$/, // Validación básica para números de teléfono (10 dígitos)
    },
}, { timestamps: true }); // Agrega campos de fecha de creación y actualización

// Crear el modelo
const User = mongoose.model('User', userSchema);

export default User;
