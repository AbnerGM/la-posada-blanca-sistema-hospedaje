const express = require('express');
const router = express.Router();

const personalController = require('../controllers/personal.controller');
const { tienePermiso } = require('../middlewares/permisos.middleware');
const { verificarToken } = require('../middlewares/auth.middleware');

router.use(verificarToken);

router.get(
    '/',
    tienePermiso('gestionar_personal'),
    personalController.obtenerUsuarios
);

router.put(
    '/:id_usuario/rol',
    tienePermiso('gestionar_personal'),
    personalController.actualizarRol
);

router.post(
    '/',
    tienePermiso('gestionar_personal'),
    personalController.crearEmpleado
);

module.exports = router;