const { pool } = require('../config/db');

async function obtenerCatalogoConReservas() {
    try {
        // Primero obtenemos las habitaciones con sus imágenes
        const [rows] = await pool.execute(`
            SELECT 
                h.id_habitacion, 
                h.nombre, 
                h.precio_noche,
                h.estado as estado_operativo,
                GROUP_CONCAT(DISTINCT i.url_imagen ORDER BY i.id_imagen SEPARATOR ',') as imagenes_concat
            FROM habitacion h
            LEFT JOIN imagenhabitacion i ON h.id_habitacion = i.id_habitacion
            WHERE h.eliminado = 0
            GROUP BY h.id_habitacion, h.nombre, h.precio_noche, h.estado
        `);

        // Para cada habitación buscamos la reserva activa hoy
        const [reservasActivas] = await pool.execute(`
            SELECT 
                dr.id_habitacion,
                r.id_reserva,
                r.estado as estado_reserva,
                u.nombre as nombre_cliente,
                r.fecha_entrada,
                r.fecha_salida
            FROM reserva r
            JOIN detallereserva dr ON r.id_reserva = dr.id_reserva
            JOIN usuario u ON r.id_usuario = u.id_usuario
            WHERE r.estado != 'cancelada'
              AND CURDATE() BETWEEN r.fecha_entrada AND r.fecha_salida
        `);

        // Para cada habitación buscamos la próxima reserva futura
        const [reservasProximas] = await pool.execute(`
            SELECT 
                dr.id_habitacion,
                r.id_reserva,
                r.estado as estado_reserva,
                u.nombre as nombre_cliente,
                r.fecha_entrada,
                r.fecha_salida
            FROM reserva r
            JOIN detallereserva dr ON r.id_reserva = dr.id_reserva
            JOIN usuario u ON r.id_usuario = u.id_usuario
            WHERE r.estado != 'cancelada'
              AND r.fecha_entrada > CURDATE()
            ORDER BY r.fecha_entrada ASC
        `);
            
        // Creamos mapas para lookup eficiente
        const mapaActivas = {};
        for (const ra of reservasActivas) {
            if (!mapaActivas[ra.id_habitacion]) {
                mapaActivas[ra.id_habitacion] = ra;
            }
        }

        const mapaProximas = {};
        for (const rp of reservasProximas) {
            if (!mapaProximas[rp.id_habitacion]) {
                mapaProximas[rp.id_habitacion] = rp;
            }
        }

        return rows.map(hab => {
            const activa = mapaActivas[hab.id_habitacion] || null;
            const proxima = mapaProximas[hab.id_habitacion] || null;

            return {
                id_habitacion: hab.id_habitacion,
                nombre: hab.nombre,
                precio_noche: parseFloat(hab.precio_noche),
                estado_operativo: hab.estado_operativo,
                estado_reserva: activa ? activa.estado_reserva : null,
                cliente_reserva: activa ? activa.nombre_cliente : null,
                fechas: activa ? `${activa.fecha_entrada} al ${activa.fecha_salida}` : null,
                cliente_proximo: proxima ? proxima.nombre_cliente : null,
                fecha_entrada_proxima: proxima ? proxima.fecha_entrada : null,
                fecha_salida_proxima: proxima ? proxima.fecha_salida : null,
                estado_reserva_proxima: proxima ? proxima.estado_reserva : null,
                imagenes: hab.imagenes_concat 
                    ? hab.imagenes_concat.split(',').filter(u => u).map(url => ({ url_imagen: url })) 
                    : []
            };
        });
    } catch (error) {
        console.error("Error en obtenerCatalogoConReservas:", error);
        throw new Error("Error al obtener el catálogo de habitaciones: " + error.message);
    }
}

async function obtenerResumenHabitaciones() {
    try {
        const query = `
            SELECT 
                h.nombre AS tipo_habitacion,
                COUNT(h.id_habitacion) AS total_inventario,
                SUM(CASE 
                    WHEN (r.id_reserva IS NULL AND h.estado = 'disponible') THEN 1 
                    ELSE 0 
                END) AS disponibles,
                SUM(CASE 
                    WHEN h.estado = 'mantenimiento' THEN 1 
                    ELSE 0 
                END) AS en_mantenimiento,
                h.precio_noche AS precio
            FROM habitacion h
            LEFT JOIN detallereserva dr 
                ON h.id_habitacion = dr.id_habitacion
                AND dr.id_reserva IN (
                    SELECT id_reserva FROM reserva
                    WHERE estado != 'cancelada'
                    AND CURDATE() BETWEEN fecha_entrada AND fecha_salida
                )
            LEFT JOIN reserva r ON dr.id_reserva = r.id_reserva
            WHERE h.eliminado = 0
            GROUP BY h.nombre, h.precio_noche
        `;
        const [rows] = await pool.execute(query);
        return rows;
    } catch (error) {
        throw new Error("Error en la consulta de inventario: " + error.message);
    }
}

module.exports = { obtenerCatalogoConReservas, obtenerResumenHabitaciones };