const { pool } = require('../config/db');

async function obtenerToursParaRecepcion() {
    try {
        const [rows] = await pool.execute(`
            SELECT 
                p.id_paquete, 
                p.nombre, 
                p.descripcion, 
                p.precio, 
                p.duracion,
                p.cupo_disponible
            FROM paqueteturistico p
            ORDER BY p.id_paquete ASC
        `);
        return rows;
    } catch (error) {
        throw error;
    }
}

async function crearPaquete(datos) {
    const { nombre, descripcion, precio, duracion, cupo_disponible } = datos;
    try {
        const [result] = await pool.execute(
            'INSERT INTO paqueteturistico (nombre, descripcion, precio, duracion, cupo_disponible) VALUES (?, ?, ?, ?, ?)',
            [nombre, descripcion || null, precio, duracion || null, cupo_disponible || 0]
        );
        return result.insertId;
    } catch (error) {
        throw error;
    }
}

async function actualizarPaquete(id, datos) {
    const { nombre, descripcion, precio, duracion, cupo_disponible } = datos;
    try {
        await pool.execute(
            'UPDATE paqueteturistico SET nombre=?, descripcion=?, precio=?, duracion=?, cupo_disponible=? WHERE id_paquete=?',
            [nombre, descripcion || null, precio, duracion || null, cupo_disponible || 0, id]
        );
        return true;
    } catch (error) {
        throw error;
    }
}

async function eliminarPaquete(id) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // Verificar si tiene compras activas
        const [compras] = await connection.execute(
            'SELECT id_compra FROM comprapaquete WHERE id_paquete = ? AND estado != "cancelada"',
            [id]
        );
        if (compras.length > 0) {
            throw new Error(`No se puede eliminar este tour porque tiene ${compras.length} reserva(s) activa(s).`);
        }

        // Eliminar compras canceladas (historial sin restricciones de FK problemáticas)
        await connection.execute('DELETE FROM comprapaquete WHERE id_paquete = ?', [id]);
        await connection.execute('DELETE FROM paqueteturistico WHERE id_paquete = ?', [id]);

        await connection.commit();
        return true;
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

async function comprarTour(datos) {
    const { id_usuario, id_paquete } = datos;
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // 1. Verificar cupos
        const [paquetes] = await connection.execute(
            'SELECT cupo_disponible, nombre FROM paqueteturistico WHERE id_paquete = ?',
            [id_paquete]
        );
        if (paquetes.length === 0) throw new Error("Tour no encontrado.");
        
        const cupo = paquetes[0].cupo_disponible;
        if (cupo <= 0) throw new Error(`No hay cupo disponible para el tour "${paquetes[0].nombre}".`);

        // 2. Insertar compra
        const [result] = await connection.execute(
            'INSERT INTO comprapaquete (id_usuario, id_paquete, fecha_compra, estado) VALUES (?, ?, NOW(), "confirmada")',
            [id_usuario, id_paquete]
        );

        // 3. Decrementar cupo
        await connection.execute(
            'UPDATE paqueteturistico SET cupo_disponible = cupo_disponible - 1 WHERE id_paquete = ?',
            [id_paquete]
        );

        await connection.commit();
        return { success: true, id_compra: result.insertId };
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

async function cancelarCompraTour(id_compra) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const [compras] = await connection.execute(
            'SELECT id_compra, id_paquete, estado FROM comprapaquete WHERE id_compra = ?',
            [id_compra]
        );
        if (compras.length === 0) throw new Error("Reserva de tour no encontrada.");
        if (compras[0].estado === 'cancelada') throw new Error("Esta reserva ya está cancelada.");

        // Marcar como cancelada
        await connection.execute(
            'UPDATE comprapaquete SET estado = "cancelada" WHERE id_compra = ?',
            [id_compra]
        );

        // Devolver cupo
        await connection.execute(
            'UPDATE paqueteturistico SET cupo_disponible = cupo_disponible + 1 WHERE id_paquete = ?',
            [compras[0].id_paquete]
        );

        await connection.commit();
        return { success: true };
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

async function obtenerHistorialCliente(id_usuario) {
    try {
        const [rows] = await pool.execute(`
            SELECT 'Tour' as tipo, c.id_compra as id_referencia, p.nombre as servicio, c.fecha_compra as fecha, c.estado 
            FROM comprapaquete c 
            JOIN paqueteturistico p ON c.id_paquete = p.id_paquete 
            WHERE c.id_usuario = ?
            UNION ALL
            SELECT 'Habitacion' as tipo, r.id_reserva as id_referencia, h.nombre as servicio, r.fecha_entrada as fecha, r.estado 
            FROM reserva r 
            JOIN detallereserva dr ON r.id_reserva = dr.id_reserva
            JOIN habitacion h ON dr.id_habitacion = h.id_habitacion
            WHERE r.id_usuario = ?
            ORDER BY fecha DESC
        `, [id_usuario, id_usuario]);
        return rows;
    } catch (error) {
        throw error;
    }
}

async function getListaClientes() {
    try {
        const [rows] = await pool.execute(`
            SELECT u.id_usuario, u.nombre, 
            (SELECT COUNT(*) FROM reserva r WHERE r.id_usuario = u.id_usuario AND r.estado = 'confirmada') as tiene_reserva,
            (SELECT COUNT(*) FROM comprapaquete c WHERE c.id_usuario = u.id_usuario AND c.estado = 'confirmada') as tiene_tour
            FROM usuario u
        `);
        return rows;
    } catch (error) {
        throw error;
    }
}

module.exports = { 
    obtenerToursParaRecepcion, 
    crearPaquete, 
    actualizarPaquete, 
    eliminarPaquete, 
    comprarTour,
    cancelarCompraTour,
    obtenerHistorialCliente,
    getListaClientes
};