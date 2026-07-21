    const express = require('express');
    const router = express.Router();

    const reservaController = require('../controllers/reserva.controller');
    const { verificarToken } = require('../middlewares/auth.middleware');

    router.get('/historial', reservaController.listarReservas);

    router.get('/historial-completo', reservaController.listarHistorialCompleto);

    router.post('/', verificarToken, reservaController.nuevaReserva);

    router.get('/mis-reservas/:id_usuario', reservaController.listarMisReservas);

    router.put('/:id/cancelar', verificarToken, reservaController.cancelarReserva);

    module.exports = router;