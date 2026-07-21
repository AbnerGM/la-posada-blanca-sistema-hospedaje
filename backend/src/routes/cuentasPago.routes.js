const express = require('express');
const router = express.Router();

const cuentasPagoController = require('../controllers/cuentasPago.controller');
const { tienePermiso } = require('../middlewares/permisos.middleware');
const { verificarToken } = require('../middlewares/auth.middleware');

router.get('/', cuentasPagoController.obtenerCuentas);

router.put(
    '/:tipo',
    verificarToken,
    tienePermiso('gestionar_cuentas_pago'),
    cuentasPagoController.actualizarCuenta
);

module.exports = router;