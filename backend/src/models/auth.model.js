const { pool } = require('../config/db'); 

async function buscarUsuarioPorCorreo(correo) {
    // En MySQL, execute devuelve un array: [filas, metadatos]. Desestructuramos [rows]
    const [rows] = await pool.execute(
        'SELECT id_usuario, nombre, contrasena, id_rol FROM usuario WHERE correo = ? AND eliminado = 0',
        [correo]
    );
    return rows[0]; 
}

// Función clásica para verificar si el correo ya existe (Para el Registro)
async function verificarCorreoExiste(correo) {   
    const [rows] = await pool.execute(
        'SELECT id_usuario FROM usuario WHERE correo = ?',
        [correo]
    );
    return rows.length > 0; 
}

// Función clásica para insertar un nuevo cliente en la BD (Para el Registro)
async function insertarUsuarioCliente(nombre, correo, contrasenaHasheada, telefono) {
    const idRolCliente = 1; // ◄ Ajustado a 3 que mapea al rol de Cliente por defecto

    await pool.execute(
        `INSERT INTO usuario (nombre, correo, contrasena, telefono, estado, eliminado, id_rol)
         VALUES (?, ?, ?, ?, 'activo', 0, ?)`,
        [nombre, correo, contrasenaHasheada, telefono || null, idRolCliente]
    );
}

async function insertarClienteRecepcion(nombre, correo, telefono, contrasenaHasheada) {
    const idRolCliente = 1;
    const [resultado] = await pool.execute(
        `INSERT INTO usuario
        (nombre, correo, contrasena, telefono, estado, estado_cuenta, eliminado, id_rol)
        VALUES (?, ?, ?, ?, 'activo', 'pendiente_activacion', 0, ?)`,
        [nombre, correo, contrasenaHasheada, telefono || null, idRolCliente]
    );
    return resultado.insertId;
}

async function guardarCodigoVerificacion(email, code) {
    await pool.execute('DELETE FROM verification_codes WHERE email = ?', [email]);
    await pool.execute(
        'INSERT INTO verification_codes (email, code, expires_at) VALUES (?, ?, NOW() + INTERVAL 1 MINUTE)',
        [email, code]
    );
}

async function verificarCodigo(email, code) {
    const [rows] = await pool.execute(
        'SELECT id FROM verification_codes WHERE email = ? AND code = ? AND expires_at > NOW()',
        [email, code]
    );
    return rows.length > 0; 
}

async function borrarCodigo(email) {
    await pool.execute('DELETE FROM verification_codes WHERE email = ?', [email]);
}

// NUEVAS FUNCIONES PARA RESET DE CONTRASEÑA
async function guardarTokenReset(email, token) {
    await pool.execute('DELETE FROM password_resets WHERE email = ?', [email]);
    await pool.execute(
        'INSERT INTO password_resets (email, token, expires_at) VALUES (?, ?, NOW() + INTERVAL 15 MINUTE)',
        [email, token]
    );
}

async function verificarYObtenerEmailPorToken(token) {
    const [rows] = await pool.execute(
        'SELECT email FROM password_resets WHERE token = ? AND expires_at > NOW()',
        [token]
    );
    return rows[0]; 
}

async function borrarToken(token) {
    await pool.execute('DELETE FROM password_resets WHERE token = ?', [token]);
}

async function actualizarContrasena(email, hashedPass) {
    await pool.execute('UPDATE usuario SET contrasena = ? WHERE correo = ?', [hashedPass, email]);
}

async function obtenerContrasenaActual(email) {
    const [rows] = await pool.execute(
        'SELECT contrasena FROM usuario WHERE correo = ?',
        [email]
    );
    return rows[0]?.contrasena || null;
}

async function obtenerClientes() {
    try {
        const [rows] = await pool.execute(
            'SELECT id_usuario, nombre, correo, telefono FROM usuario WHERE eliminado = 0 AND id_rol = 1'
        );
        return rows;
    } catch (error) {
        throw error;
    }
}

// Trae los datos del perfil de un usuario cualquiera (Cliente, Recepcionista, Admin)
async function obtenerPerfilPorId(id_usuario) {
    try {
        const [rows] = await pool.execute(
            'SELECT id_usuario, nombre, correo, telefono, id_rol FROM usuario WHERE id_usuario = ? AND eliminado = 0',
            [id_usuario]
        );
        return rows[0];
    } catch (error) {
        throw error;
    }
}

// Actualiza solo correo y/o telefono (lo que el usuario cambie desde "Mi Perfil")
async function actualizarPerfilUsuario(id_usuario, datos) {
    const { correo, telefono } = datos;
    try {
        await pool.execute(
            'UPDATE usuario SET correo = ?, telefono = ? WHERE id_usuario = ?',
            [correo, telefono, id_usuario]
        );
        return true;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    buscarUsuarioPorCorreo,
    verificarCorreoExiste,
    insertarUsuarioCliente,
    insertarClienteRecepcion,
    guardarCodigoVerificacion, 
    verificarCodigo,           
    borrarCodigo,
    guardarTokenReset,
    verificarYObtenerEmailPorToken,
    borrarToken,
    actualizarContrasena,
    obtenerContrasenaActual,
    obtenerClientes,
    obtenerPerfilPorId,
    actualizarPerfilUsuario
};