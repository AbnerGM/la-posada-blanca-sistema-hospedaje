const { obtenerCatalogoConReservas ,obtenerResumenHabitaciones} = require('../models/recep.model');

async function obtenerPanelRecepcion(req, res) {
    try {
        const datos = await obtenerCatalogoConReservas();
        
        return res.status(200).json({
            success: true,
            data: datos
        });
    } catch (error) {
        console.error("Error en panel recepción:", error);
        
        return res.status(500).json({ 
            success: false, 
            message: "Error al cargar la información del panel",
            error: error.message 
        });
    }
}

async function obtenerPanelResumen(req, res) {
    try {
        const resumen = await obtenerResumenHabitaciones();
        
        return res.status(200).json({
            success: true,
            data: resumen
        });
    } catch (error) {
        console.error("Error al obtener resumen de habitaciones:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Error al cargar el resumen",
            error: error.message 
        });
    }
}
module.exports = { obtenerPanelRecepcion, obtenerPanelResumen };