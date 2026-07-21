const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const authModel = require('../models/auth.model');
const { sendPasswordResetEmail } = require('../utils/mailer'); 

const solicitarReset = async (req, res) => {
    const { email } = req.body;
    try {
        const usuario = await authModel.buscarUsuarioPorCorreo(email);
        if (!usuario) {
            return res.json({ message: "Si el correo está registrado, se han enviado las instrucciones." });
        }

        const token = crypto.randomBytes(32).toString('hex');
        await authModel.guardarTokenReset(email, token);

        const resetLink = `https://laposadablanca.duckdns.org/auth/reset-password?token=${token}`;
        await sendPasswordResetEmail(email, resetLink);

        res.json({ message: "Instrucciones enviadas correctamente." });
    } catch (error) {
        console.error("Error en solicitarReset:", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
};

const resetearContrasena = async (req, res) => {
    const { token, nuevaContrasena } = req.body;
    
    if (!token || !nuevaContrasena) {
        return res.status(400).json({ message: "Datos incompletos para el reseteo." });
    }

    const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    if (!regexPassword.test(nuevaContrasena)) {
        return res.status(400).json({ message: "La contraseña debe tener 8+ caracteres, mayúscula, minúscula y un número." });
    }

    try {
        const datos = await authModel.verificarYObtenerEmailPorToken(token);
        if (!datos) return res.status(400).json({ message: "Token inválido o expirado." });

        const contrasenaActual = await authModel.obtenerContrasenaActual(datos.email);
        if (contrasenaActual) {
            const esIgual = await bcrypt.compare(nuevaContrasena, contrasenaActual);
            if (esIgual) {
                return res.status(400).json({ message: "La nueva contraseña no puede ser igual a la anterior." });
            }
        }

        const hashed = await bcrypt.hash(nuevaContrasena, 10);
        await authModel.actualizarContrasena(datos.email, hashed);
        await authModel.borrarToken(token);

        res.json({ message: "Contraseña actualizada con éxito." });
    } catch (error) {
        console.error("Error en resetearContrasena:", error);
        res.status(500).json({ message: "Error al actualizar la contraseña." });
    }
};

module.exports = { 
    solicitarReset, 
    resetearContrasena 
};