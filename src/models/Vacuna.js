import mongoose from 'mongoose';

const vacunaSchema = new mongoose.Schema({
    nombre_comun: { type: String, required: true },
    nombre_cientifico: { type: String, required: true },
    administracion: { type: String, required: true },
    dosis: { type: String, required: true }
});

const Vacuna = mongoose.model('Vacuna', vacunaSchema);
export default Vacuna;
