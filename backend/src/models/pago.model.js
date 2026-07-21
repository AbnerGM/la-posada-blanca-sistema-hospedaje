const { pool } = require('../config/db');

const registrarPago = async (datos) => {
    const {
            id_reserva, monto, metodo_pago, comprobante
          } = datos;

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();
        // Registrar el pago
        const [resultado] = await connection.execute(
            `INSERT INTO pago
            (id_reserva, monto, metodo_pago, estado, comprobante)
            VALUES (?, ?, ?, ?, ?)`,
            [
                id_reserva, monto, metodo_pago, 'en_revision', comprobante
            ]
        );

        // Cambiar el estado de la reserva
        await connection.execute(
            `UPDATE reserva
             SET estado = ?
             WHERE id_reserva = ?`,
            [ 'pago_en_revision', id_reserva ]
        );
        await connection.commit();
        return resultado.insertId;

    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

const listarPagosPendientes = async () => {
    const [rows] = await pool.execute(`
        SELECT 
            p.id_pago, p.id_reserva, p.monto, p.metodo_pago, p.estado, p.comprobante, p.fecha_pago,
            r.fecha_entrada, r.fecha_salida, u.nombre, u.correo
        FROM pago p
        INNER JOIN reserva r ON p.id_reserva = r.id_reserva
        INNER JOIN usuario u ON r.id_usuario = u.id_usuario
        WHERE p.estado = 'en_revision'
        ORDER BY p.fecha_pago DESC
    `);
    return rows;
};

const aprobarPago = async (id_pago) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        const [pagos] = await connection.execute(
            `SELECT id_reserva FROM pago WHERE id_pago = ?`,
            [id_pago]
        );
        if (pagos.length === 0) {
            await connection.rollback();
            return null;
        }
        const id_reserva = pagos[0].id_reserva;

        await connection.execute(
            `UPDATE pago
             SET estado = 'aprobado', fecha_revision = NOW()
             WHERE id_pago = ?`,
            [id_pago]
        );
        await connection.execute(
            `UPDATE reserva
             SET estado = 'confirmada'
             WHERE id_reserva = ?`,
            [id_reserva]
        );
        await connection.commit();
        return true;
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

const obtenerDatosCorreoPago = async (id_pago) => {
  const [rows] = await pool.execute(`
    SELECT p.id_pago, p.monto, p.estado, r.id_reserva, r.fecha_entrada, r.fecha_salida, r.total,
           u.nombre, u.correo, h.nombre AS habitacion
    FROM pago p
    INNER JOIN reserva r ON p.id_reserva = r.id_reserva
    INNER JOIN usuario u ON r.id_usuario = u.id_usuario
    INNER JOIN detallereserva dr ON r.id_reserva = dr.id_reserva
    INNER JOIN habitacion h ON dr.id_habitacion = h.id_habitacion
    WHERE p.id_pago = ?
  `, [id_pago]);
  return rows[0];
};

const rechazarPago = async (id_pago, motivo_rechazo) => {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();
        const [pagos] = await connection.execute(
            `SELECT id_reserva FROM pago WHERE id_pago = ?`,
            [id_pago]
        );
        if (pagos.length === 0) {
            await connection.rollback();
            return null;
        }
        const id_reserva = pagos[0].id_reserva;
        await connection.execute(
            `UPDATE pago
             SET estado = 'rechazado', motivo_rechazo = ?, fecha_revision = NOW()
             WHERE id_pago = ?`,
            [motivo_rechazo, id_pago]
        );
        await connection.execute(
            `UPDATE reserva
             SET estado = 'pendiente_pago'
             WHERE id_reserva = ?`,
            [id_reserva]
        );
        await connection.commit();
        return true;
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

module.exports = {
    registrarPago, listarPagosPendientes, aprobarPago, obtenerDatosCorreoPago, rechazarPago };