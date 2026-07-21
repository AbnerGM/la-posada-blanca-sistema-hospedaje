const express = require('express');
const router = express.Router();
const { obtenerPanelRecepcion, obtenerPanelResumen } = require('../controllers/recep.controller');

router.get('/panel', obtenerPanelRecepcion);

router.get('/resumen-habitaciones', obtenerPanelResumen);
module.exports = router;