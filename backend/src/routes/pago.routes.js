const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const pagoController = require('../controllers/pago.controller');
const { verificarToken } = require('../middlewares/auth.middleware');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/comprobantes');
    },
    filename: (req, file, cb) => {
        const extension = path.extname(file.originalname);
        const nombreArchivo = `comprobante_${Date.now()}${extension}`;
        cb(null, nombreArchivo);
    }
});

const upload = multer({ storage });

router.get('/test', (req, res) => {
    res.json({ mensaje: 'Ruta de pagos funcionando' });
});

router.get('/pendientes', pagoController.listarPagosPendientes);

router.post('/', upload.single('comprobante'), pagoController.registrarPago);

router.put('/:id/aprobar', verificarToken, pagoController.aprobarPago);

router.put('/:id/rechazar', verificarToken, pagoController.rechazarPago);

module.exports = router;