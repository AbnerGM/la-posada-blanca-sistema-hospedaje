const { pool } = require('../config/db');

async function registrarActividad(id_usuario, accion, descripcion) {
    try {
        const [usuarios] = await pool.execute(
            'SELECT nombre, id_rol FROM usuario WHERE id_usuario = ?',
            [id_usuario]
        );

        if (usuarios.length === 0) return;

        const { nombre: nombre_usuario, id_rol } = usuarios[0];

        if (id_rol === 1) return;

        await pool.execute(
            `INSERT INTO log_actividad (id_usuario, nombre_usuario, accion, descripcion)
             VALUES (?, ?, ?, ?)`,
            [id_usuario, nombre_usuario, accion, descripcion]
        );
    } catch (error) {
        console.error('No se pudo registrar la actividad en el log:', error);
    }
}

module.exports = { registrarActividad };