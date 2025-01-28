// app.js
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para parsear JSON
app.use(express.json());

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Conectado a MongoDB'))
.catch(err => console.error('Error al conectar a MongoDB:', err));

// Rutas (ejemplo)
app.get('/', (req, res) => {
    res.send('¡Hola chama amor mio magdualida');
});

app.post('/users', async (req, res) => {
    // Imprimir el cuerpo de la solicitud para depuración
    console.log('Cuerpo de la solicitud:', req.body);

    const { nombre, apellido, correo, cedula, finca, telefono } = req.body;

    // Validar los datos recibidos
    if (!nombre || !apellido || !correo || !cedula || !finca || !telefono) {
        console.error('Faltan datos requeridos:', { nombre, apellido, correo, cedula, finca, telefono });
        return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    const user = new User({ nombre, apellido, correo, cedula, finca, telefono });

    try {
        await user.save();
        console.log('Usuario creado:', user); // Log del usuario creado
        res.status(201).json(user); // Responder con el usuario creado
    } catch (error) {
        if (error.code === 11000) {
            // Manejo específico para errores de duplicados
            console.error('Error de duplicado:', error);
            return res.status(400).json({ error: 'El correo o cédula ya existe' });
        }
        console.error('Error al crear el usuario:', error);
        res.status(500).json({ error: 'Error al crear el usuario' });
    }
});


// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
