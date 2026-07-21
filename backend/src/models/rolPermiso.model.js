const { pool } = require('../config/db');

// Trae todos los roles (incluye es_base para saber cuales no se pueden borrar)
async function obtenerTodosLosRoles() {
    try {
        const [rows] = await pool.execute(
            'SELECT id_rol, nombre_rol, es_base FROM rol ORDER BY id_rol'
        );
        return rows;
    } catch (error) {
        throw error;
    }
}

// Trae todo el catalogo de permisos (para dibujar las filas de la matriz)
async function obtenerTodosLosPermisos() {
    try {
        const [rows] = await pool.execute(
            'SELECT id_permiso, clave, nombre, categoria FROM permisos ORDER BY categoria, id_permiso'
        );
        return rows;
    } catch (error) {
        throw error;
    }
}

// Trae todas las asignaciones actuales (que rol tiene que permiso)
async function obtenerAsignaciones() {
    try {
        const [rows] = await pool.execute(
            'SELECT id_rol, id_permiso FROM rol_permiso'
        );
        return rows;
    } catch (error) {
        throw error;
    }
}

// Trae solo las claves de permiso de UN rol (usado por el middleware y por AuthContext)
async function obtenerClavesPermisosDeRol(id_rol) {
    try {
        const [rows] = await pool.execute(
            `SELECT p.clave
             FROM rol_permiso rp
             JOIN permisos p ON p.id_permiso = rp.id_permiso
             WHERE rp.id_rol = ?`,
            [id_rol]
        );
        return rows.map(r => r.clave);
    } catch (error) {
        throw error;
    }
}

// Revisa si un rol tiene una clave de permiso especifica (usado por el middleware)
async function rolTienePermiso(id_rol, clave) {
    try {
        const [rows] = await pool.execute(
            `SELECT 1
             FROM rol_permiso rp
             JOIN permisos p ON p.id_permiso = rp.id_permiso
             WHERE rp.id_rol = ? AND p.clave = ?
             LIMIT 1`,
            [id_rol, clave]
        );
        return rows.length > 0;
    } catch (error) {
        throw error;
    }
}

// Reemplaza TODOS los permisos de un rol por la lista nueva que llega de la pantalla
// (borra lo anterior y vuelve a insertar, dentro de una transaccion)
async function reemplazarPermisosDeRol(id_rol, idsPermisos) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        await connection.execute(
            'DELETE FROM rol_permiso WHERE id_rol = ?',
            [id_rol]
        );

        if (idsPermisos.length > 0) {
            const valores = idsPermisos.map(id_permiso => [id_rol, id_permiso]);
            await connection.query(
                'INSERT INTO rol_permiso (id_rol, id_permiso) VALUES ?',
                [valores]
            );
        }

        await connection.commit();
        return true;
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

// Crea un rol nuevo (ej: "Personal de Limpieza"), siempre con es_base = 0
async function crearRol(nombre_rol) {
    try {
        const [result] = await pool.execute(
            'INSERT INTO rol (nombre_rol, es_base) VALUES (?, 0)',
            [nombre_rol]
        );
        return result.insertId;
    } catch (error) {
        throw error;
    }
}

// Busca un rol por su id (para validar es_base antes de eliminar)
async function buscarRolPorId(id_rol) {
    try {
        const [rows] = await pool.execute(
            'SELECT id_rol, nombre_rol, es_base FROM rol WHERE id_rol = ?',
            [id_rol]
        );
        return rows[0];
    } catch (error) {
        throw error;
    }
}

// Elimina un rol (el controller ya valida antes que es_base sea 0)
async function eliminarRol(id_rol) {
    try {
        await pool.execute('DELETE FROM rol WHERE id_rol = ?', [id_rol]);
        return true;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    obtenerTodosLosRoles,
    obtenerTodosLosPermisos,
    obtenerAsignaciones,
    obtenerClavesPermisosDeRol,
    rolTienePermiso,
    reemplazarPermisosDeRol,
    crearRol,
    buscarRolPorId,
    eliminarRol
};