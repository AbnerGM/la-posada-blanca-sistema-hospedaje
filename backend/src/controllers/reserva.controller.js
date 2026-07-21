const ReservaModel = require('../models/reserva.model');
const { sendReservaRecepcionEmail, sendNuevaReservaStaffEmail } = require('../utils/mailer');
const { obtenerCorreosStaff } = require('../models/personal.model');
const { registrarActividad } = require('../utils/auditoria');

const listarReservas = async (req, res) => {
    try {
        const reservas = await ReservaModel.obtenerHistorialReservas();
        res.status(200).json({ success: true, data: reservas });
    } catch (error) {
        console.error("Error en listarReservas:", error);
        res.status(500).json({ success: false, message: "Error al obtener historial de reservas" });
    }
};

const listarHistorialCompleto = async (req, res) => {
    try {
        const datos = await ReservaModel.obtenerHistorialCompleto();
        res.status(200).json({ success: true, data: datos });
    } catch (error) {
        console.error("Error en listarHistorialCompleto:", error);
        res.status(500).json({ success: false, message: "Error al obtener historial completo" });
    }
};

const nuevaReserva = async (req, res) => {
    try {
        const { id_usuario, id_habitacion, fecha_entrada, fecha_salida, origen } = req.body;

        if (!id_usuario || !id_habitacion || !fecha_entrada || !fecha_salida) {
            return res.status(400).json({ 
                success: false, 
                message: "Faltan datos requeridos: usuario, habitación y fechas son obligatorios." 
            });
        }

        const resultado = await ReservaModel.crearReservaCompleta({
            id_usuario,
            id_habitacion,
            fecha_entrada,
            fecha_salida,
            origen
        });
        if (resultado.datosStaff) {
            const correosStaff = await obtenerCorreosStaff();
            for (const correo of correosStaff) {
                await sendNuevaReservaStaffEmail(correo, resultado.datosStaff);
            }
        }
        await registrarActividad(
            req.usuario.id,
            'crear_reserva',
            `Creo la reserva #${resultado.id_reserva} para la habitacion ${id_habitacion}`
        );
        res.status(201).json({ 
            success: true, 
            message: "¡Reserva creada exitosamente!", 
            id_reserva: resultado.id_reserva,
            total: resultado.total,
            noches: resultado.noches
        });

    } catch (error) {
        console.error("Error en nuevaReserva:", error.message);
        res.status(400).json({ 
            success: false, 
            message: error.message || "Error al procesar la reserva" 
        });
    }
};

const cancelarReserva = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id || isNaN(id)) {
            return res.status(400).json({ success: false, message: "ID de reserva inválido." });
        }
        await ReservaModel.cancelarReserva(id);
        await registrarActividad(
            req.usuario.id,
            'cancelar_reserva',
            `Cancelo la reserva #${id}`
        );
        res.status(200).json({ success: true, message: "Reserva cancelada correctamente." });
    } catch (error) {
        console.error("Error en cancelarReserva:", error.message);
        res.status(400).json({ success: false, message: error.message || "Error al cancelar la reserva" });
    }
};

const listarMisReservas = async (req, res) => {
    try {
        const { id_usuario } = req.params;

        const reservas = await ReservaModel.obtenerMisReservas(id_usuario);

        res.status(200).json({
            success: true,
            data: reservas
        });

    } catch (error) {
        console.error("Error en listarMisReservas:", error);
        res.status(500).json({
            success: false,
            message: "Error al obtener las reservas del cliente."
        });
    }
};

module.exports = { listarReservas, listarHistorialCompleto, nuevaReserva, cancelarReserva, listarMisReservas };