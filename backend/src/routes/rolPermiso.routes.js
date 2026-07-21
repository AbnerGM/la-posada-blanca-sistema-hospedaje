const express = require('express');
const router = express.Router();

const rolPermisoController = require('../controllers/rolPermiso.controller');
const { tienePermiso } = require('../middlewares/permisos.middleware');

const { verificarToken } = require('../middlewares/auth.middleware');

router.use(verificarToken);

router.get(
    '/matriz',
    tienePermiso('gestionar_roles_permisos'),
    rolPermisoController.obtenerMatriz
);

router.put(
    '/rol/:id_rol',
    tienePermiso('gestionar_roles_permisos'),
    rolPermisoController.actualizarPermisosDeRol
);

router.post(
    '/rol',
    tienePermiso('gestionar_roles_permisos'),
    rolPermisoController.crearRol
);

router.delete(
    '/rol/:id_rol',
    tienePermiso('gestionar_roles_permisos'),
    rolPermisoController.eliminarRol
);

router.get('/mis-permisos', rolPermisoController.obtenerMisPermisos);

module.exports = router;