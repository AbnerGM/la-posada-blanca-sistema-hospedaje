const { pool } = require('../config/db');

async function obtenerHistorial(limite = 100) {
    try {
        const limiteSeguro = Number(limite) || 100;
        const [rows] = await pool.query(
            `SELECT id_log, id_usuario, nombre_usuario, accion, descripcion, fecha
             FROM log_actividad
             ORDER BY fecha DESC
             LIMIT ${limiteSeguro}`
        );
        return rows;
    } catch (error) {
        throw error;
    }
}

module.exports = { obtenerHistorial };