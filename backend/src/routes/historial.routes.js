const express = require('express');
const router = express.Router();

const historialController = require('../controllers/historial.controller');
const { tienePermiso } = require('../middlewares/permisos.middleware');
const { verificarToken } = require('../middlewares/auth.middleware');

router.use(verificarToken);

router.get(
    '/',
    tienePermiso('ver_historial_actividad'),
    historialController.obtenerHistorial
);

module.exports = router;