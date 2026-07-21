const rolPermisoModel = require('../models/rolPermiso.model');
const { registrarActividad } = require('../utils/auditoria');

async function obtenerMatriz(req, res) {
    try {
        const roles = await rolPermisoModel.obtenerTodosLosRoles();
        const permisos = await rolPermisoModel.obtenerTodosLosPermisos();
        const asignaciones = await rolPermisoModel.obtenerAsignaciones();

        res.status(200).json({ roles, permisos, asignaciones });
    } catch (error) {
        console.error('Error al obtener la matriz de roles y permisos:', error);
        res.status(500).json({ message: 'Error al obtener roles y permisos.' });
    }
}

async function actualizarPermisosDeRol(req, res) {
    try {
        const { id_rol } = req.params;
        const { idsPermisos } = req.body;

        if (!Array.isArray(idsPermisos)) {
            return res.status(400).json({ message: 'idsPermisos debe ser un arreglo.' });
        }

        const rol = await rolPermisoModel.buscarRolPorId(id_rol);
        if (!rol) {
            return res.status(404).json({ message: 'El rol no existe.' });
        }

        await rolPermisoModel.reemplazarPermisosDeRol(id_rol, idsPermisos);
        await registrarActividad(
            req.usuario.id,
            'actualizar_permisos',
            `Modifico los permisos del rol "${rol.nombre_rol}"`
        );
        res.status(200).json({ message: 'Permisos actualizados.' });
    } catch (error) {
        console.error('Error al actualizar permisos del rol:', error);
        res.status(500).json({ message: 'Error al actualizar los permisos.' });
    }
}

async function crearRol(req, res) {
    try {
        const { nombre_rol } = req.body;

        if (!nombre_rol || !nombre_rol.trim()) {
            return res.status(400).json({ message: 'El nombre del rol es obligatorio.' });
        }

        const id_rol = await rolPermisoModel.crearRol(nombre_rol.trim());
        await registrarActividad(
            req.usuario.id,
            'crear_rol',
            `Creo el rol "${nombre_rol.trim()}"`
        );
        res.status(201).json({ message: 'Rol creado.', id_rol });
    } catch (error) {
        console.error('Error al crear el rol:', error);
        res.status(500).json({ message: 'Error al crear el rol.' });
    }
}

async function eliminarRol(req, res) {
    try {
        const { id_rol } = req.params;

        const rol = await rolPermisoModel.buscarRolPorId(id_rol);
        if (!rol) {
            return res.status(404).json({ message: 'El rol no existe.' });
        }

        if (rol.es_base) {
            return res.status(403).json({ message: 'No se puede eliminar un rol base del sistema.' });
        }

        await rolPermisoModel.eliminarRol(id_rol);
        await registrarActividad(
            req.usuario.id,
            'eliminar_rol',
            `Elimino el rol "${rol.nombre_rol}"`
        );
        res.status(200).json({ message: 'Rol eliminado.' });
    } catch (error) {
        console.error('Error al eliminar el rol:', error);
        res.status(500).json({ message: 'Error al eliminar el rol.' });
    }
}

async function obtenerMisPermisos(req, res) {
    try {
        const { rol } = req.usuario; 
        const claves = await rolPermisoModel.obtenerClavesPermisosDeRol(rol);
        res.status(200).json({ permisos: claves });
    } catch (error) {
        console.error('Error al obtener mis permisos:', error);
        res.status(500).json({ message: 'Error al obtener los permisos.' });
    }
}

module.exports = {
    obtenerMatriz,
    actualizarPermisosDeRol,
    crearRol,
    eliminarRol,
    obtenerMisPermisos
};