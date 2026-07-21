const express = require('express');
const router = express.Router();

const registerController = require('../controllers/register.controller');
const { loginUsuario } = require('../controllers/login.controller');
const { verificarDni } = require('../controllers/dni.controller');
const { solicitarReset, resetearContrasena } = require('../controllers/reset.controller');

router.post('/login', loginUsuario);
router.get('/dni/:dni', verificarDni);
router.get('/clientes', registerController.listarClientes);
router.post('/clientes/recepcion', registerController.registrarClienteRecepcion);
router.post('/iniciar-registro', registerController.iniciarRegistro);
router.post('/confirmar-registro', registerController.confirmarRegistro);
router.get('/perfil/:id', registerController.obtenerPerfil);
router.put('/perfil/:id', registerController.actualizarPerfil);

router.post('/solicitar-reset', solicitarReset);
router.post('/resetear-password', resetearContrasena);

module.exports = router;