// app.js
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Vacuna from './src/models/Vacuna.js'; // Asegúrate de que esta ruta sea correcta
import User from './src/models/User.js';
import bcrypt from 'bcrypt';
import cors from 'cors';


dotenv.config();

const app = express();
app.use(cors());

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



// Endpoint para obtener todas las vacunas
app.get('/vacunas', async (req, res) => {
    try {
        // Busca todas las vacunas en la colección
        const vacunas = await Vacuna.find();
        
        // Devuelve las vacunas como respuesta en formato JSON
        res.status(200).json(vacunas);
    } catch (error) {
        // Si hay un error, lo capturas y devuelves un mensaje de error
        console.error('Error al obtener las vacunas:', error);
        res.status(500).json({ error: 'Error al obtener las vacunas' });
    }
});

// Ruta para obtener todos los usuarios
app.get('/users', async (req, res) => {
    try {
        const users = await User.find(); // Obtener todos los usuarios
        res.status(200).json(users); // Devolver los usuarios como respuesta
    } catch (error) {
        console.error('Error al obtener los usuarios:', error);
        res.status(500).json({ error: 'Error al obtener los usuarios' });
    }
});

// Ruta para crear un nuevo usuario con contraseña [Admin]
app.post('/users/admin', async (req, res) => {
    const { nombre, apellido, correo, cedula, finca, telefono, password } = req.body;

    // Validar los datos recibidos
    if (!nombre || !apellido || !correo || !cedula || !finca || !telefono || !password) {
        return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    try {
        // Hashear la contraseña antes de guardar al usuario
        const hashedPassword = await bcrypt.hash(password, 10); // Salt rounds = 10

        const user = new User({
            nombre,
            apellido,
            correo,
            cedula,
            finca,
            telefono,
            password: hashedPassword // Guardar la contraseña hasheada
        });

        await user.save();
        res.status(201).json({ message: 'Usuario creado exitosamente', user });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ error: 'El correo o cédula ya existe' });
        }
        console.error('Error al crear el usuario:', error);
        res.status(500).json({ error: 'Error al crear el usuario' });
    }
});

// Ruta para crear un nuevo usuario sin contraseña
app.post('/users/', async (req, res) => {
    const { nombre, apellido, correo, cedula, finca, telefono, resEnDeclaracion } = req.body;

    // Validar los datos recibidos
    if (!nombre || !apellido || !correo || !cedula || !finca || !telefono) {
        return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    try {
        const user = new User({
            nombre,
            apellido,
            correo,
            cedula,
            finca,
            telefono,
            resEnDeclaracion: resEnDeclaracion || [] // Inicializa como array vacío si no se proporciona
        });

        await user.save();
        res.status(201).json({ message: 'Usuario creado exitosamente', user });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ error: 'El correo o cédula ya existe' });
        }
        console.error('Error al crear el usuario:', error);
        res.status(500).json({ error: 'Error al crear el usuario' });
    }
});

// Ruta para editar un usuario por ID
app.post('/users/:id', async (req, res) => {
    const { id } = req.params; // Obtener el ID del usuario desde la URL
    const { nombre, apellido, correo, cedula, finca, telefono } = req.body;

    // Validar los datos recibidos
    if (!nombre || !apellido || !correo || !cedula || !finca || !telefono) {
        return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    try {
        const user = await User.findByIdAndUpdate(
            id,
            { nombre, apellido, correo, cedula, finca, telefono },
            { new: true } // Devuelve el documento actualizado
        );

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.status(200).json({message: 'Usuario creado editado exitosamente',user}); // Devolver el usuario actualizado
    } catch (error) {
        console.error('Error al editar el usuario:', error);
        res.status(500).json({ error: 'Error al editar el usuario' });
    }
});

// buscar users

app.get('/users/search', async (req, res) => {
    const { term } = req.query; // Obtener el parámetro de consulta 'term'

    if (!term) {
        return res.status(400).json({ error: 'Se requiere un término de búsqueda' });
    }

    // Crear un objeto de búsqueda
    let searchCriteria = {};

    // Verificar si el término es solo números (asumiendo que es una cédula)
    if (/^\d+$/.test(term)) {
        searchCriteria.cedula = term; // Búsqueda exacta por cédula
    } else if (/\S+@\S+\.\S+/.test(term)) {
        // Si el término parece ser un correo electrónico
        searchCriteria.correo = { $regex: term, $options: 'i' }; // Búsqueda insensible a mayúsculas
    } else {
        // Separar los términos por espacio para permitir búsquedas múltiples
        const terms = term.split(' ').map(t => t.trim()).filter(t => t.length > 0);

        // Crear condiciones para nombre y apellido
        const nameConditions = terms.map(t => ({
            $or: [
                { nombre: { $regex: t, $options: 'i' } }, // Insensible a mayúsculas
                { apellido: { $regex: t, $options: 'i' } } // Insensible a mayúsculas
            ]
        }));

        // Unir las condiciones con $and
        searchCriteria = { $and: nameConditions };
    }

    try {
        const users = await User.find(searchCriteria); // Buscar usuarios según los criterios
        res.status(200).json(users); // Devolver todos los usuarios encontrados
    } catch (error) {
        console.error('Error al buscar usuarios:', error);
        res.status(500).json({ error: 'Error al buscar usuarios' });
    }
});

// borrar usuario
app.delete('/users/:id', async (req, res) => {
    const { id } = req.params; // Obtener el ID del usuario desde la URL

    try {
        const user = await User.findByIdAndDelete(id); // Buscar y eliminar el usuario por ID

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.status(200).json({ message: 'Usuario eliminado exitosamente' }); // Respuesta de éxito
    } catch (error) {
        console.error('Error al eliminar el usuario:', error);
        res.status(500).json({ error: 'Error al eliminar el usuario' });
    }
});

// login

app.post('/login', async (req, res) => {
    const { correo, password } = req.body;

    // Validar los datos recibidos
    if (!correo || !password) {
        return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    try {
        // Buscar el usuario por correo
        const user = await User.findOne({ correo });
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Comparar la contraseña ingresada con la hasheada
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Contraseña incorrecta' });
        }

        // Si las credenciales son válidas, devolver una respuesta exitosa
        res.status(200).json({ message: 'Inicio de sesión exitoso', user });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
});

// Ruta para agregar un objeto a resEnDeclaracion
app.post('/users/:id/res-en-declaracion', async (req, res) => {
    const { id } = req.params; // ID del usuario al que se le agregará el objeto
    const { cabezasVAC } = req.body; // Número de cabezas de ganado

    if (!cabezasVAC || isNaN(cabezasVAC)) {
        return res.status(400).json({ error: 'El campo cabezasVAC es requerido y debe ser un número' });
    }

    try {
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Crear el nuevo objeto para agregar al array
        const newResEnDeclaracion = {
            cabezasVAC,
            createapt: new Date(), // Fecha actual como createapt
            updateapt: new Date(), // Fecha actual como updateapt
        };

        // Agregar el nuevo objeto al array resEnDeclaracion
        user.resEnDeclaracion.push(newResEnDeclaracion);

        // Guardar los cambios en la base de datos
        await user.save();

        res.status(201).json({ message: 'Objeto agregado exitosamente a resEnDeclaracion', user });
    } catch (error) {
        console.error('Error al agregar a resEnDeclaracion:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Ruta para obtener la declaración más reciente de un usuario
app.get('/users/:id/res-en-declaracion', async (req, res) => {
    const { id } = req.params; // ID del usuario

    try {
        // Buscar al usuario por su ID
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        // Verificar si hay declaraciones en resEnDeclaracion
        if (!user.resEnDeclaracion || user.resEnDeclaracion.length === 0) {
            return res.status(404).json({ error: 'No hay declaraciones disponibles para este usuario' });
        }
        // Ordenar las declaraciones por createapt en orden descendente
        const recentDeclaration = user.resEnDeclaracion.sort((a, b) => {
            return new Date(b.createapt) - new Date(a.createapt); // Más reciente primero
        })[0]; // Obtener solo la primera declaración
        // Devolver la declaración más reciente
        res.status(200).json(recentDeclaration);
    } catch (error) {
        console.error('Error al obtener la declaración más reciente:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});





// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
