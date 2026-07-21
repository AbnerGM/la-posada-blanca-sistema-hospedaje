const { pool } = require('../config/db'); 

// Validamos si ya existe la habitación por su nombre
async function buscarHabitacionPorNombre(nombre) {
    try {
        const [rows] = await pool.execute(
            'SELECT id_habitacion, nombre, precio_noche, capacidad, descripcion, estado FROM habitacion WHERE nombre = ? AND eliminado = 0',
            [nombre]
        );
        return rows[0]; 
    } catch (error) {
        throw error;
    }
}

async function insertarHabitacion(datos) {
    const { nombre, precio_noche, capacidad, descripcion } = datos;
    try {
        const [result] = await pool.execute(
            `INSERT INTO habitacion (nombre, precio_noche, capacidad, descripcion)
             VALUES (?, ?, ?, ?)`,
            [nombre, precio_noche, capacidad, descripcion || null]
        );
        return result.insertId;
    } catch (error) {
        throw error;
    }
}

// Buscamos la habitación por su ID para mostrar sus datos actuales en el formulario de edición
async function buscarHabitacionPorId(id) {
    try {
        const [rows] = await pool.execute(
            'SELECT id_habitacion, nombre, precio_noche, capacidad, descripcion, estado FROM habitacion WHERE id_habitacion = ? AND eliminado = 0',
            [id]
        );
        return rows[0]; 
    } catch (error) {
        throw error;
    }
}

// Modificar los datos en la BD por su ID
async function actualizarHabitacion(id, datos) {
    const { nombre, precio_noche, capacidad, descripcion } = datos;
    try {
        await pool.execute(
            `UPDATE habitacion 
             SET nombre = ?, 
                 precio_noche = ?, 
                 capacidad = ?, 
                 descripcion = ?
             WHERE id_habitacion = ? AND eliminado = 0`,
            [nombre, precio_noche, capacidad, descripcion || null, id]
        );
        return true;
    } catch (error) {
        throw error;
    }
}

// Usamos la eliminación lógica con el soft delete para no perder la integridad 
async function eliminarLogicoHabitacion(id) {
    try {
        await pool.execute(
            'UPDATE habitacion SET eliminado = 1 WHERE id_habitacion = ?',
            [id]
        );
        return true;
    } catch (error) {
        throw error;
    }
}

// Función para insertar la URL de la imagen en la tabla de imagenhabitacion
async function insertarImagenHabitacion(id_habitacion, url_imagen) {
    try {
        await pool.execute(
            'INSERT INTO imagenhabitacion (id_habitacion, url_imagen) VALUES (?, ?)',
            [id_habitacion, url_imagen]
        );
        return true;
    } catch (error) {
        throw error;
    }
}

// Función para listar las habitaciones disponibles en un rango de fechas específico
async function listarHabitacionesDisponibles(fecha_entrada, fecha_salida, capacidad = 0) {
    try {
        const query = `
            SELECT h.id_habitacion, h.nombre, h.precio_noche, h.capacidad, h.descripcion, h.estado,
                   GROUP_CONCAT(i.url_imagen) as imagenes_concat,
                   (SELECT COUNT(*) FROM detallereserva dr 
                    JOIN reserva r ON dr.id_reserva = r.id_reserva 
                    WHERE dr.id_habitacion = h.id_habitacion 
                    AND r.estado != 'cancelada' 
                    AND (? < r.fecha_salida AND ? > r.fecha_entrada)) as conteo_reservas
            FROM habitacion h
            LEFT JOIN imagenhabitacion i ON h.id_habitacion = i.id_habitacion
            WHERE h.eliminado = 0 
              AND h.capacidad >= ?
            GROUP BY h.id_habitacion, h.nombre, h.precio_noche, h.capacidad, h.descripcion, h.estado
        `;
        
        const [rows] = await pool.execute(query, [fecha_entrada, fecha_salida, capacidad]);
        
        return rows.map(h => ({
            id_habitacion: h.id_habitacion,
            nombre: h.nombre,
            precio_noche: parseFloat(h.precio_noche),
            capacidad: h.capacidad,
            descripcion: h.descripcion,
            estado: h.estado,
            esta_ocupada: (h.conteo_reservas > 0 || h.estado !== 'disponible'),
            imagenes: h.imagenes_concat ? h.imagenes_concat.split(',').map(url => ({ url_imagen: url })) : []
        })).filter(h => !h.esta_ocupada);
        
    } catch (error) { 
        throw error; 
    }
}

// Función para obtener las imágenes de una habitación específica por su ID
async function obtenerImagenesPorHabitacion(id_habitacion) {
    try {
        const [rows] = await pool.execute(
            `SELECT id_imagen, id_habitacion, url_imagen 
             FROM imagenhabitacion
             WHERE id_habitacion = ?`,
            [id_habitacion]
        );
        return rows; 
    } catch (error) {
        throw error;
    }
}

async function obtenerCatalogoHabitaciones() {
    try {
        const query = `
            SELECT h.id_habitacion, h.nombre, h.precio_noche, h.capacidad, h.descripcion, h.estado,
                   GROUP_CONCAT(i.url_imagen) as imagenes_concat,
                   MAX(CASE 
                       WHEN r.id_reserva IS NOT NULL OR h.estado != 'disponible' THEN 1 
                       ELSE 0 
                   END) as esta_ocupada
            FROM habitacion h
            LEFT JOIN imagenhabitacion i ON h.id_habitacion = i.id_habitacion
            LEFT JOIN detallereserva dr ON h.id_habitacion = dr.id_habitacion
            LEFT JOIN reserva r ON dr.id_reserva = r.id_reserva 
                  AND r.estado != 'cancelada' 
                  AND CURDATE() BETWEEN r.fecha_entrada AND r.fecha_salida
            WHERE h.eliminado = 0
            GROUP BY h.id_habitacion, h.nombre, h.precio_noche, h.capacidad, h.descripcion, h.estado
        `;
        const [rows] = await pool.execute(query);
        
        return rows.map(hab => ({
            ...hab,
            esta_ocupada: hab.esta_ocupada === 1, 
            imagenes: hab.imagenes_concat ? hab.imagenes_concat.split(',').map(url => ({ url_imagen: url })) : []
        }));
    } catch (error) {
        throw error;
    }
}
module.exports = {
    buscarHabitacionPorNombre,
    buscarHabitacionPorId, 
    insertarHabitacion,
    actualizarHabitacion,
    eliminarLogicoHabitacion,
    insertarImagenHabitacion,
    listarHabitacionesDisponibles,
    obtenerImagenesPorHabitacion, 
    obtenerCatalogoHabitaciones
};