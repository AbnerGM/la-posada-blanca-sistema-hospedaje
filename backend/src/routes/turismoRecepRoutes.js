const express = require('express');
const router = express.Router();
const turismoRecepController = require('../controllers/turismoRecepController');

router.post('/', turismoRecepController.crearPaquete);
router.put('/:id', turismoRecepController.actualizarPaquete);
router.delete('/:id', turismoRecepController.eliminarPaquete);

router.get('/', turismoRecepController.getResumenTours);
router.post('/reservar', turismoRecepController.reservarTour);
router.put('/compra/:id/cancelar', turismoRecepController.cancelarCompraTour);

router.get('/clientes/lista', turismoRecepController.getListaClientes);

router.get('/clientes/:id/historial', turismoRecepController.getHistorialCliente);

module.exports = router;