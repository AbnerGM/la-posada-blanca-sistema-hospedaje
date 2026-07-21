const rolPermisoModel = require('../models/rolPermiso.model');

function tienePermiso(clave) {
    return async function (req, res, next) {
        try {           
            if (!req.usuario) {
                return res.status(401).json({ message: 'Acceso denegado. No se proporciono un token.' });
            }

            const autorizado = await rolPermisoModel.rolTienePermiso(req.usuario.rol, clave);

            if (!autorizado) {
                return res.status(403).json({ message: 'No tienes permisos para realizar esta accion.' });
            }

            next();
        } catch (error) {
            console.error('Error al verificar permiso:', error);
            res.status(500).json({ message: 'Error al verificar permisos.' });
        }
    };
}

module.exports = { tienePermiso };