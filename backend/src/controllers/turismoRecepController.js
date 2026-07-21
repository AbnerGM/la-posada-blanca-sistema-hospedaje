const turismoRecepModel = require('../models/turismoRecepModel');

async function getResumenTours(req, res) {
    try {
        const tours = await turismoRecepModel.obtenerToursParaRecepcion();
        res.status(200).json({ success: true, data: tours });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener tours' });
    }
}

async function reservarTour(req, res) {
    const { id_usuario, id_paquete } = req.body;

    if (!id_usuario || !id_paquete) {
        return res.status(400).json({ success: false, message: "Faltan datos obligatorios: usuario y paquete." });
    }

    try {
        const resultado = await turismoRecepModel.comprarTour({ id_usuario, id_paquete });
        return res.status(201).json({
            success: true,
            message: "¡Tour reservado exitosamente!",
            id_compra: resultado.id_compra
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message || "Error al procesar reserva de tour"
        });
    }
}

async function crearPaquete(req, res) {
    const { nombre, descripcion, precio, duracion, cupo_disponible } = req.body;
    if (!nombre || precio === undefined) {
        return res.status(400).json({ success: false, message: "El nombre y el precio son obligatorios." });
    }
    try {
        const id = await turismoRecepModel.crearPaquete({ nombre, descripcion, precio, duracion, cupo_disponible });
        return res.status(201).json({ success: true, message: "Paquete turístico creado exitosamente.", id_paquete: id });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error al crear el paquete." });
    }
}

async function actualizarPaquete(req, res) {
    const { id } = req.params;
    const { nombre, descripcion, precio, duracion, cupo_disponible } = req.body;
    if (!nombre || precio === undefined) {
        return res.status(400).json({ success: false, message: "El nombre y el precio son obligatorios." });
    }
    try {
        await turismoRecepModel.actualizarPaquete(id, { nombre, descripcion, precio, duracion, cupo_disponible });
        return res.status(200).json({ success: true, message: "Paquete actualizado correctamente." });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error al actualizar el paquete." });
    }
}

async function eliminarPaquete(req, res) {
    const { id } = req.params;
    try {
        await turismoRecepModel.eliminarPaquete(id);
        return res.status(200).json({ success: true, message: "Paquete turístico eliminado correctamente." });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message || "Error al eliminar el paquete." });
    }
}

async function cancelarCompraTour(req, res) {
    const { id } = req.params;
    try {
        await turismoRecepModel.cancelarCompraTour(id);
        return res.status(200).json({ success: true, message: "Reserva de tour cancelada correctamente." });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message || "Error al cancelar la reserva de tour." });
    }
}



async function getHistorialCliente(req, res) {
    const { id } = req.params; 
    try {
        const historial = await turismoRecepModel.obtenerHistorialCliente(id);
        res.status(200).json({ success: true, data: historial });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener historial' });
    }
}

async function getListaClientes(req, res) {
    try {
        const clientes = await turismoRecepModel.getListaClientes();
        res.status(200).json({ success: true, data: clientes });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener lista de clientes' });
    }
}

module.exports = { getResumenTours, reservarTour, crearPaquete, actualizarPaquete, eliminarPaquete, cancelarCompraTour, getHistorialCliente,getListaClientes };