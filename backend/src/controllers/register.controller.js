const { encriptarPassword } = require('../utils/hash');
const crypto = require('crypto');
const { verificarCorreoExiste, insertarUsuarioCliente, insertarClienteRecepcion, guardarCodigoVerificacion, 
    verificarCodigo, borrarCodigo, obtenerClientes, obtenerPerfilPorId, actualizarPerfilUsuario} = require('../models/auth.model');

const { sendVerificationEmail } = require('../utils/mailer');


async function iniciarRegistro(req, res) {
    const { nombre, correo, contrasena, telefono } = req.body;

    if (!nombre || !correo || !contrasena || !telefono) 
        return res.status(400).json({ message: "Todos los campos obligatorios deben llenarse." });
    
    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexCorreo.test(correo)) 
        return res.status(400).json({ message: "El formato del correo es inválido." });

    const regexTelefono = /^9\d{8}$/;
    if (!regexTelefono.test(telefono)) 
        return res.status(400).json({ message: "El teléfono debe empezar con 9 y tener 9 dígitos." });

    const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    if (!regexPassword.test(contrasena)) 
        return res.status(400).json({ message: "La contraseña debe tener 8+ caracteres, mayúscula, minúscula y un número." });

    try {
        const existe = await verificarCorreoExiste(correo);
        if (existe) return res.status(400).json({ message: "El correo ya se encuentra registrado." });

        const code = Math.floor(100000 + Math.random() * 900000).toString();
        await guardarCodigoVerificacion(correo, code);
        await sendVerificationEmail(correo, code);

        return res.status(200).json({ message: "Código de verificación enviado a tu correo." });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error interno al iniciar el registro." });
    }
}

async function confirmarRegistro(req, res) {
    const { nombre, correo, contrasena, telefono, code } = req.body;

    try {
        const esValido = await verificarCodigo(correo, code);
        if (!esValido) return res.status(400).json({ message: "Código inválido o expirado." });

        const contrasenaHasheada = await encriptarPassword(contrasena);
        await insertarUsuarioCliente(nombre, correo, contrasenaHasheada, telefono);
        await borrarCodigo(correo);

        return res.status(201).json({ message: "Usuario registrado con éxito." });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al finalizar el registro." });
    }
}

async function listarClientes(req, res) {
    try {
        const clientes = await obtenerClientes();
        return res.status(200).json({ success: true, data: clientes });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Error interno al recuperar los clientes." });
    }
}

async function registrarClienteRecepcion(req, res) {
    const { nombre, correo, telefono } = req.body;
    if (!nombre || !correo)
        return res.status(400).json({ success: false, message: 'Nombre y correo son obligatorios.' });
    try {
        const existe = await verificarCorreoExiste(correo);
        if (existe)
            return res.status(400).json({ success: false, message: 'El correo ya está registrado.' });
        const passwordTemporal = crypto.randomBytes(8).toString('hex');
        const passwordHash = await encriptarPassword(passwordTemporal);
        const id_usuario = await insertarClienteRecepcion(
            nombre,
            correo,
            telefono,
            passwordHash
        );
        return res.status(201).json({
            success: true,
            id_usuario,
            nombre,
            correo
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Error al registrar el cliente.'
        });
    }
}

async function obtenerPerfil(req, res) {
    try {
        const { id } = req.params;
        const perfil = await obtenerPerfilPorId(id);
        if (!perfil) return res.status(404).json({ message: 'Usuario no encontrado.' });

        return res.status(200).json({ success: true, data: perfil });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al obtener el perfil.' });
    }
}

async function actualizarPerfil(req, res) {
    try {
        const { id } = req.params;
        const { correo, telefono } = req.body;

        if (!correo || !telefono) {
            return res.status(400).json({ message: 'Correo y teléfono son obligatorios.' });
        }

        await actualizarPerfilUsuario(id, { correo, telefono });
        return res.status(200).json({ message: 'Perfil actualizado correctamente.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al actualizar el perfil.' });
    }
}

module.exports = { iniciarRegistro, confirmarRegistro, listarClientes, registrarClienteRecepcion, obtenerPerfil, actualizarPerfil };