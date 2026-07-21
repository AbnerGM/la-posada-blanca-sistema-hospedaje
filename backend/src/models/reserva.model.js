const { pool } = require('../config/db');

// Historial solo de reservas de habitaciones
const obtenerHistorialReservas = async () => {
    const query = `
        SELECT 
            r.id_reserva,
            u.nombre as nombre_usuario,
            u.correo,
            h.nombre as nombre_habitacion,
            r.fecha_entrada,
            r.fecha_salida,
            r.total as monto_total,
            r.estado,
            r.fecha_creacion,
            'habitacion' as tipo_reserva
        FROM reserva r
        JOIN usuario u ON r.id_usuario = u.id_usuario
        JOIN detallereserva dr ON r.id_reserva = dr.id_reserva
        JOIN habitacion h ON dr.id_habitacion = h.id_habitacion
        ORDER BY r.fecha_creacion DESC
    `;
    const [rows] = await pool.execute(query);
    return rows;
};

// Historial completo: reservas de habitaciones + compras de tours
const obtenerHistorialCompleto = async () => {
    // Reservas de habitaciones
    const [reservasHab] = await pool.execute(`
        SELECT 
            r.id_reserva as id,
            u.nombre as nombre_usuario,
            u.correo,
            h.nombre as nombre_item,
            DATE_FORMAT(r.fecha_entrada, '%Y-%m-%d') as fecha_entrada,
            DATE_FORMAT(r.fecha_salida, '%Y-%m-%d') as fecha_salida,
            r.total as monto_total,
            r.estado,
            r.fecha_creacion,
            'habitacion' as tipo_reserva
        FROM reserva r
        JOIN usuario u ON r.id_usuario = u.id_usuario
        JOIN detallereserva dr ON r.id_reserva = dr.id_reserva
        JOIN habitacion h ON dr.id_habitacion = h.id_habitacion
        ORDER BY r.fecha_creacion DESC
    `);

    // Reservas de tours (comprapaquete)
    const [reservasTour] = await pool.execute(`
        SELECT 
            cp.id_compra as id,
            u.nombre as nombre_usuario,
            u.correo,
            pt.nombre as nombre_item,
            NULL as fecha_entrada,
            NULL as fecha_salida,
            pt.precio as monto_total,
            cp.estado,
            cp.fecha_compra as fecha_creacion,
            'tour' as tipo_reserva
        FROM comprapaquete cp
        JOIN usuario u ON cp.id_usuario = u.id_usuario
        JOIN paqueteturistico pt ON cp.id_paquete = pt.id_paquete
        ORDER BY cp.fecha_compra DESC
    `);

    return { reservasHab, reservasTour };
};

const crearReservaCompleta = async (datos) => {
    const { id_usuario, fecha_entrada, fecha_salida, id_habitacion, origen } = datos;
    const connection = await pool.getConnection();
    
    try {
        await connection.beginTransaction();

        // 1. Verificar que el estado de la habitación sea 'disponible'
        const [habs] = await connection.execute(
            'SELECT precio_noche, estado FROM habitacion WHERE id_habitacion = ? AND eliminado = 0',
            [id_habitacion]
        );
        if (habs.length === 0) throw new Error("Habitación no encontrada.");
        if (habs[0].estado !== 'disponible') {
            throw new Error(`La habitación no está disponible (estado: ${habs[0].estado}).`);
        }

        // 2. VALIDAR DISPONIBILIDAD: Verificar que no haya reservas en esas fechas
        const [conflictos] = await connection.execute(`
            SELECT dr.id_reserva FROM detallereserva dr
            JOIN reserva r ON dr.id_reserva = r.id_reserva
            WHERE dr.id_habitacion = ? 
            AND r.estado != 'cancelada'
            AND (? < r.fecha_salida AND ? > r.fecha_entrada)
        `, [id_habitacion, fecha_entrada, fecha_salida]);

        if (conflictos.length > 0) {
            throw new Error("La habitación ya está reservada en las fechas seleccionadas.");
        }

        const precioPorNoche = habs[0].precio_noche;

        // 3. CALCULAR NOCHES Y TOTAL
        const inicio = new Date(fecha_entrada);
        const fin = new Date(fecha_salida);
        const diffTime = fin.getTime() - inicio.getTime();
        const cantidadNoches = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (cantidadNoches <= 0) throw new Error("La fecha de salida debe ser mayor a la de entrada.");
        
        const totalCalculado = cantidadNoches * precioPorNoche;

        // 4. INSERTAR RESERVA
        const [reservaResult] = await connection.execute(
            'INSERT INTO reserva (id_usuario, fecha_entrada, fecha_salida, total, estado, fecha_creacion) VALUES (?, ?, ?, ?, "pendiente_pago", NOW())',
            [id_usuario, fecha_entrada, fecha_salida, totalCalculado]
        );

        // 5. INSERTAR DETALLE
        await connection.execute(
            'INSERT INTO detallereserva (id_reserva, id_habitacion, precio_por_noche, cantidad_noches) VALUES (?, ?, ?, ?)',
            [reservaResult.insertId, id_habitacion, precioPorNoche, cantidadNoches]
        );

        await connection.commit();

        let datosCorreo = null;
        let datosStaff = null;

        // Traemos nombre del cliente y de la habitacion, los necesitamos en ambos casos
        const [rows] = await connection.execute(`
            SELECT u.nombre, u.correo, h.nombre AS habitacion
            FROM usuario u
            JOIN habitacion h ON h.id_habitacion = ?
            WHERE u.id_usuario = ?
        `, [id_habitacion, id_usuario]);

        if (origen === 'recepcion') {
            // El Recepcionista creo la reserva: el Cliente recibe un correo
            datosCorreo = {
                ...rows[0], fecha_entrada, fecha_salida, total: totalCalculado
            };
        } else {
            // El Cliente reservo por su cuenta: el staff recibe una notificacion
            datosStaff = {
                nombreCliente: rows[0]?.nombre,
                habitacion: rows[0]?.habitacion,
                fecha_entrada,
                fecha_salida,
                total: totalCalculado,
                id_reserva: reservaResult.insertId
            };
        }
        return { success: true, id_reserva: reservaResult.insertId, total: totalCalculado, noches: cantidadNoches, datosCorreo, datosStaff };

    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

const cancelarReserva = async (id_reserva) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // Verificar que existe
        const [reservas] = await connection.execute(
            'SELECT id_reserva, estado FROM reserva WHERE id_reserva = ?',
            [id_reserva]
        );
        if (reservas.length === 0) throw new Error("Reserva no encontrada.");
        if (reservas[0].estado === 'cancelada') throw new Error("La reserva ya está cancelada.");

        // Cancelar la reserva (no eliminar para mantener integridad referencial)
        await connection.execute(
            'UPDATE reserva SET estado = "cancelada" WHERE id_reserva = ?',
            [id_reserva]
        );

        await connection.commit();
        return { success: true };
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

const obtenerMisReservas = async (id_usuario) => {
    const [rows] = await pool.execute(`
        SELECT r.id_reserva, h.nombre AS nombre_habitacion, r.fecha_entrada, r.fecha_salida,
               dr.cantidad_noches, r.total, r.estado, r.fecha_creacion,
               p.estado AS estado_pago, p.metodo_pago
        FROM reserva r
        JOIN detallereserva dr ON r.id_reserva = dr.id_reserva
        JOIN habitacion h ON dr.id_habitacion = h.id_habitacion
        LEFT JOIN pago p ON r.id_reserva = p.id_reserva
        WHERE r.id_usuario = ?
        ORDER BY r.fecha_creacion DESC
    `, [id_usuario]);

    return rows;
};

module.exports = { 
    obtenerHistorialReservas, 
    obtenerHistorialCompleto,
    crearReservaCompleta,
    cancelarReserva,
    obtenerMisReservas
};