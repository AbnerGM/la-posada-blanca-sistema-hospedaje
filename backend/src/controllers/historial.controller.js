const historialModel = require('../models/historial.model');

async function obtenerHistorial(req, res) {
    try {
        const historial = await historialModel.obtenerHistorial(100);
        res.status(200).json({ historial });
    } catch (error) {
        console.error('Error al obtener el historial de actividad:', error);
        res.status(500).json({ message: 'Error al obtener el historial.' });
    }
}

module.exports = { obtenerHistorial };