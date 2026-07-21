const { pool } = require('../config/db');

// Trae todos los usuarios con el nombre de su rol (para la tabla de Gestión de Personal)
async function obtenerTodosLosUsuarios() {
    try {
        const [rows] = await pool.execute(
            `SELECT u.id_usuario, u.nombre, u.correo, u.telefono, u.estado, u.estado_cuenta,
                    u.id_rol, r.nombre_rol
             FROM usuario u
             JOIN rol r ON r.id_rol = u.id_rol
             WHERE u.eliminado = 0
               AND u.id_rol != 1
             ORDER BY u.nombre`
        );
        return rows;
    } catch (error) {
        throw error;
    }
}

// Busca un usuario por su id (para validar que existe antes de cambiarle el rol)
async function buscarUsuarioPorId(id_usuario) {
    try {
        const [rows] = await pool.execute(
            'SELECT id_usuario, nombre, correo, id_rol FROM usuario WHERE id_usuario = ? AND eliminado = 0',
            [id_usuario]
        );
        return rows[0];
    } catch (error) {
        throw error;
    }
}

// Cambia el rol de un usuario (esto es lo que dispara el dropdown en la pantalla)
async function actualizarRolDeUsuario(id_usuario, id_rol) {
    try {
        await pool.execute(
            'UPDATE usuario SET id_rol = ? WHERE id_usuario = ?',
            [id_rol, id_usuario]
        );
        return true;
    } catch (error) {
        throw error;
    }
}

async function obtenerCorreosStaff() {
    try {
        const [rows] = await pool.execute(
            `SELECT correo FROM usuario
             WHERE id_rol != 1 AND eliminado = 0`
        );
        return rows.map(r => r.correo);
    } catch (error) {
        throw error;
    }
}

async function crearEmpleado(nombre, correo, telefono, id_rol, contrasenaHasheada) {
    try {
        const [resultado] = await pool.execute(
            `INSERT INTO usuario
            (nombre, correo, contrasena, telefono, estado, estado_cuenta, eliminado, id_rol)
            VALUES (?, ?, ?, ?, 'activo', 'pendiente_activacion', 0, ?)`,
            [nombre, correo, contrasenaHasheada, telefono || null, id_rol]
        );
        return resultado.insertId;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    obtenerTodosLosUsuarios,
    buscarUsuarioPorId,
    actualizarRolDeUsuario,
    obtenerCorreosStaff,
    crearEmpleado
};