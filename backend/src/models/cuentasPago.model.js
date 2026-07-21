const { pool } = require('../config/db');

async function obtenerCuentasPago() {
    try {
        const [rows] = await pool.execute(
            'SELECT id_cuenta, tipo, titular, numero, banco, cci, url_qr FROM cuentas_pago'
        );
        return rows;
    } catch (error) {
        throw error;
    }
}

async function actualizarCuentaPago(tipo, datos) {
    const { titular, numero, banco, cci, url_qr } = datos;
    try {
        await pool.execute(
            `UPDATE cuentas_pago
             SET titular = ?, numero = ?, banco = ?, cci = ?, url_qr = ?
             WHERE tipo = ?`,
            [titular || null, numero || null, banco || null, cci || null, url_qr || null, tipo]
        );
        return true;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    obtenerCuentasPago,
    actualizarCuentaPago
};