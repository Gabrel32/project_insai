// src/models/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const resEnDeclaracionSchema = new mongoose.Schema({
    createapt: { type: Date, default: Date.now }, // Fecha de creación automática
    updateapt: { type: Date, default: Date.now }, // Fecha de actualización automática
    cabezasVAC: { type: Number, required: true }, // Número de cabezas de ganado
});

const userSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    apellido: { type: String, required: true },
    correo: { type: String, required: true, unique: true },
    cedula: { type: String, required: true, unique: true },
    finca: { type: String, required: true },
    telefono: { type: String, required: true },
    password: { type: String }, // Campo para la contraseña hasheada (opcional)
    resEnDeclaracion: [resEnDeclaracionSchema], // Array de objetos con esquema definido
    createdAt: { type: Date, default: Date.now }, // Fecha de creación automática
    updatedAt: { type: Date, default: Date.now }, // Fecha de actualización automática
});

// Middleware para actualizar el campo updatedAt antes de guardar
userSchema.pre('save', function (next) {
    this.updatedAt = Date.now(); // Actualiza el campo updatedAt al guardar
    next();
});

// Método para comparar contraseñas
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
