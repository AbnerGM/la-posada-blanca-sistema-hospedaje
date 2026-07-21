const cuentasPagoModel = require('../models/cuentasPago.model');
const { registrarActividad } = require('../utils/auditoria');

async function obtenerCuentas(req, res) {
    try {
        const cuentas = await cuentasPagoModel.obtenerCuentasPago();
        res.status(200).json({ cuentas });
    } catch (error) {
        console.error('Error al obtener cuentas de pago:', error);
        res.status(500).json({ message: 'Error al obtener las cuentas de pago.' });
    }
}

async function actualizarCuenta(req, res) {
    try {
        const { tipo } = req.params;

        if (tipo !== 'yape' && tipo !== 'transferencia') {
            return res.status(400).json({ message: 'Tipo de cuenta invalido.' });
        }

        await cuentasPagoModel.actualizarCuentaPago(tipo, req.body);

        await registrarActividad(
            req.usuario.id,
            'editar_cuenta_pago',
            `Actualizo los datos de la cuenta de pago "${tipo}"`
        );

        res.status(200).json({ message: 'Cuenta de pago actualizada.' });
    } catch (error) {
        console.error('Error al actualizar cuenta de pago:', error);
        res.status(500).json({ message: 'Error al actualizar la cuenta de pago.' });
    }
}

module.exports = {
    obtenerCuentas,
    actualizarCuenta
};