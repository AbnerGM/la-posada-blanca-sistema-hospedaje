const { 
    buscarHabitacionPorNombre, 
    insertarHabitacion, 
    buscarHabitacionPorId, 
    actualizarHabitacion,
    eliminarLogicoHabitacion,
    insertarImagenHabitacion,
    listarHabitacionesDisponibles,
    obtenerImagenesPorHabitacion, 
    obtenerCatalogoHabitaciones
} = require('../models/habitacion.model');

const { registrarActividad } = require('../utils/auditoria');

async function crearHabitacion(req, res) {
    const { nombre, precio_noche, capacidad, descripcion, imagenes } = req.body;

    if (!nombre || precio_noche === undefined || capacidad === undefined) {
        return res.status(400).json({ 
            message: "Por favor, complete todos los campos obligatorios: Nombre, Precio y Capacidad." 
        });
    }

    if (Number(precio_noche) <= 0 || Number(capacidad) <= 0) {
        return res.status(400).json({ 
            message: "El precio por noche y la capacidad deben ser valores numéricos mayores a cero." 
        });
    }

    try {
        const habitacionExiste = await buscarHabitacionPorNombre(nombre);
        if (habitacionExiste) {
            return res.status(400).json({ 
                message: `La habitación '${nombre}' ya se encuentra registrada en el sistema.` 
            });
        }

        const id_habitacion = await insertarHabitacion({ nombre, precio_noche, capacidad, descripcion });

        if (Array.isArray(imagenes) && imagenes.length > 0) {
            for (const url of imagenes) {
                if (url && url.trim() !== '') {
                    await insertarImagenHabitacion(id_habitacion, url.trim());
                }
            }
        }
        await registrarActividad(
            req.usuario.id,
            'crear_habitacion',
            `Creo la habitacion "${nombre}"`
        );

        return res.status(201).json({
            message: "Habitacion registrada exitosamente.",
            habitacion: {
                id_habitacion,
                nombre,
                precio_noche,
                capacidad,
                descripcion,
                estado: "disponible",
                imagenes: Array.isArray(imagenes) ? imagenes.map(url => ({ url_imagen: url })) : []
            }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error interno del servidor al crear la habitación." });
    }
}

async function obtenerHabitacionPorId(req, res) {
    const { id } = req.params;

    try {
        const habitacion = await buscarHabitacionPorId(id);
        
        if (!habitacion) {
            return res.status(404).json({ message: "La habitación solicitada no existe o fue eliminada." });
        }

        return res.status(200).json(habitacion);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error interno del servidor al obtener la habitación." });
    }
}

async function modificarHabitacion(req, res) {
    const { id } = req.params;
    const { nombre, precio_noche, capacidad, descripcion } = req.body;

    if (!nombre || precio_noche === undefined || capacidad === undefined) {
        return res.status(400).json({ 
            message: "Por favor, complete todos los campos obligatorios: Nombre, Precio y Capacidad." 
        });
    }

    if (Number(precio_noche) <= 0 || Number(capacidad) <= 0) {
        return res.status(400).json({ 
            message: "El precio por noche y la capacidad deben ser valores numéricos mayores a cero." 
        });
    }

    try {
        const habitacionExiste = await buscarHabitacionPorId(id);
        if (!habitacionExiste) {
            return res.status(404).json({ message: "No se puede actualizar una habitación que no existe." });
        }

        await actualizarHabitacion(id, { nombre, precio_noche, capacidad, descripcion });
        await registrarActividad(
            req.usuario.id,
            'editar_habitacion',
            `Edito la habitacion "${nombre}"`
        );
        return res.status(200).json({
            message: "Habitación actualizada exitosamente.",
            habitacion: {
                id_habitacion: id,
                nombre,
                precio_noche,
                capacidad,
                descripcion
            }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error interno del servidor al actualizar la habitación." });
    }
}

async function eliminarHabitacion(req, res) {
    const { id } = req.params;

    try {
        const habitacion = await buscarHabitacionPorId(id);
        if (!habitacion) {
            return res.status(404).json({ message: "La habitación no existe o ya fue eliminada." });
        }

        await eliminarLogicoHabitacion(id);
        await registrarActividad(
            req.usuario.id,
            'eliminar_habitacion',
            `Elimino la habitacion "${habitacion.nombre}"`
        );
        return res.status(200).json({ 
            message: "Habitación eliminada exitosamente del sistema." 
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error interno del servidor al eliminar la habitación." });
    }
}





async function subirImagenUrl(req, res) {
    const { id } = req.params; 
    const { url_imagen } = req.body; 

    if (!url_imagen) {
        return res.status(400).json({ message: "Por favor, proporcione la URL de la imagen." });
    }

    const extensionValida = url_imagen.toLowerCase().endsWith('.jpg') || 
                            url_imagen.toLowerCase().endsWith('.jpeg') || 
                            url_imagen.toLowerCase().endsWith('.png');
    
    if (!extensionValida) {
        return res.status(400).json({ 
            message: "Formato de imagen inválido. Solo se admiten enlaces que terminen en .jpg, .jpeg o .png" 
        });
    }

    try {
        const habitacionExiste = await buscarHabitacionPorId(id);
        if (!habitacionExiste) {
            return res.status(404).json({ message: "La habitación especificada no existe." });
        }

        await insertarImagenHabitacion(id, url_imagen);

        return res.status(201).json({
            message: "Imagen registrada exitosamente",
            datos: {
                id_habitacion: id,
                url_imagen
            }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error interno del servidor al registrar la imagen." });
    }
}




async function obtenerDisponibilidad(req, res) {
    const { fechaEntrada, fechaSalida } = req.query; 

    if (!fechaEntrada || !fechaSalida) {
        return res.status(400).json({ 
            message: "Por favor, proporcione los parámetros obligatorios: fechaEntrada y fechaSalida." 
        });
    }

    if (new Date(fechaEntrada) >= new Date(fechaSalida)) {
        return res.status(400).json({ 
            message: "La fecha de salida debe ser posterior a la fecha de entrada." 
        });
    }

    try {
        const habitaciones = await listarHabitacionesDisponibles(fechaEntrada, fechaSalida);

        return res.status(200).json({
            message: "Consulta de disponibilidad realizada con éxito.",
            total_resultados: habitaciones.length,
            habitaciones
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error interno del servidor al consultar disponibilidad." });
    }
}



async function listarImagenesHabitacion(req, res) {
    const { id } = req.params; 

    if (isNaN(id)) {
        return res.status(400).json({ message: "El ID de la habitación debe ser un número válido." });
    }

    try {
        const imagenes = await obtenerImagenesPorHabitacion(id);

        return res.status(200).json({
    total_resultados: imagenes.length,
    imagenes
});

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error interno del servidor al recuperar las imágenes." });
    }
}


async function listarHabitaciones(req, res) {
    let { fechaEntrada, fechaSalida, capacidad } = req.query;

    try {
        const cap = Number(capacidad) || 0;

        if (!fechaEntrada || !fechaSalida) {
            const catalogo = await obtenerCatalogoHabitaciones();
            return res.status(200).json(catalogo);
        }

        const habitaciones = await listarHabitacionesDisponibles(fechaEntrada, fechaSalida, cap);
        return res.status(200).json(habitaciones);

    } catch (error) {
        console.error("Error en listarHabitaciones:", error);
        return res.status(500).json({ message: "Error interno al recuperar las habitaciones." });
    }
}

module.exports = { 
    crearHabitacion, 
    obtenerHabitacionPorId, 
    modificarHabitacion,
    eliminarHabitacion,
    subirImagenUrl,
    obtenerDisponibilidad,
    listarImagenesHabitacion,
    listarHabitaciones
};