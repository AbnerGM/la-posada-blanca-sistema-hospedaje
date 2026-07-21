const { compararPassword } = require('../utils/hash');
const jwt = require('jsonwebtoken');
const { buscarUsuarioPorCorreo } = require('../models/auth.model');
require('dotenv').config();

async function loginUsuario(req, res) {
    const { correo, contrasena } = req.body;

    if (!correo || !contrasena) {
        return res.status(400).json({ message: "Por favor, ingrese correo y contraseña." });
    }

    try {
        const usuario = await buscarUsuarioPorCorreo(correo);

        if (!usuario) {
            return res.status(404).json({ message: "El usuario no existe o credenciales incorrectas." });
        }

        const contraseñaCorrecta = await compararPassword(contrasena, usuario.contrasena);
        if (!contraseñaCorrecta) {
            return res.status(400).json({ message: "Contraseña incorrecta o credenciales incorrectas." });
        }

        const token = jwt.sign(
            { id: usuario.id_usuario, rol: usuario.id_rol },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        return res.status(200).json({
            message: "Inicio de sesión exitoso.",
            token,
            usuario: {
                id: usuario.id_usuario,
                nombre: usuario.nombre,
                rol: usuario.id_rol
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error interno del servidor al iniciar sesión." });
    }
}

module.exports = { loginUsuario };