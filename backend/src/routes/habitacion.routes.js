const express = require('express');
const router = express.Router();
const { 
    crearHabitacion, 
    obtenerHabitacionPorId, 
    modificarHabitacion,
    eliminarHabitacion,
    subirImagenUrl,
    obtenerDisponibilidad,
    listarImagenesHabitacion,
    listarHabitaciones
} = require('../controllers/habitacion.controller');

const { verificarToken } = require('../middlewares/auth.middleware');

router.get('/habitaciones', listarHabitaciones);
router.post('/habitaciones', verificarToken, crearHabitacion);

router.get('/habitaciones/disponibilidad', obtenerDisponibilidad);

router.get('/habitaciones/:id/imagenes', listarImagenesHabitacion);

router.get('/habitaciones/:id', obtenerHabitacionPorId);
router.put('/habitaciones/:id', verificarToken, modificarHabitacion);

router.put('/habitaciones/eliminar/:id', verificarToken, eliminarHabitacion);

router.post('/habitaciones/:id/imagenes', subirImagenUrl); 


module.exports = router;