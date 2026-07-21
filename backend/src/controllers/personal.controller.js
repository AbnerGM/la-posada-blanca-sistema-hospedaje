const personalModel = require('../models/personal.model');
const rolPermisoModel = require('../models/rolPermiso.model');
const { registrarActividad } = require('../utils/auditoria');
const crypto = require('crypto');
const { encriptarPassword } = require('../utils/hash');
const { sendEmpleadoCreadoEmail } = require('../utils/mailer');
const { verificarCorreoExiste } = require('../models/auth.model');

async function obtenerUsuarios(req, res) {
    try {
        const usuarios = await personalModel.obtenerTodosLosUsuarios();
        res.status(200).json({ usuarios });
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ message: 'Error al obtener la lista de personal.' });
    }
}

async function actualizarRol(req, res) {
    try {
        const { id_usuario } = req.params;
        const { id_rol } = req.body;

        if (!id_rol) {
            return res.status(400).json({ message: 'id_rol es obligatorio.' });
        }

        const usuario = await personalModel.buscarUsuarioPorId(id_usuario);
        if (!usuario) {
            return res.status(404).json({ message: 'El usuario no existe.' });
        }

        const rol = await rolPermisoModel.buscarRolPorId(id_rol);
        if (!rol) {
            return res.status(404).json({ message: 'El rol seleccionado no existe.' });
        }

        await personalModel.actualizarRolDeUsuario(id_usuario, id_rol);
        await registrarActividad(
            req.usuario.id,
            'cambiar_rol',
            `Cambio el rol de "${usuario.nombre}" a "${rol.nombre_rol}"`
        );
        res.status(200).json({ message: 'Rol actualizado correctamente.' });
    } catch (error) {
        console.error('Error al actualizar el rol del usuario:', error);
        res.status(500).json({ message: 'Error al actualizar el rol.' });
    }
}
async function crearEmpleado(req, res) {
    try {
        const { nombre, correo, telefono, id_rol } = req.body;

        if (!nombre || !correo || !id_rol) {
            return res.status(400).json({ message: 'Nombre, correo y rol son obligatorios.' });
        }

        const existe = await verificarCorreoExiste(correo);
        if (existe) {
            return res.status(400).json({ message: 'El correo ya se encuentra registrado.' });
        }

        const rol = await rolPermisoModel.buscarRolPorId(id_rol);
        if (!rol) {
            return res.status(404).json({ message: 'El rol seleccionado no existe.' });
        }

        const passwordTemporal = crypto.randomBytes(8).toString('hex');
        const passwordHash = await encriptarPassword(passwordTemporal);

        const id_usuario = await personalModel.crearEmpleado(nombre, correo, telefono, id_rol, passwordHash);

        await sendEmpleadoCreadoEmail(correo, { nombre, rol: rol.nombre_rol });

        await registrarActividad(
            req.usuario.id,
            'crear_empleado',
            `Registro a "${nombre}" como "${rol.nombre_rol}"`
        );

        res.status(201).json({ message: 'Empleado registrado correctamente.', id_usuario });
    } catch (error) {
        console.error('Error al crear empleado:', error);
        res.status(500).json({ message: 'Error al registrar el empleado.' });
    }
}

module.exports = {
    obtenerUsuarios,
    actualizarRol,
    crearEmpleado
};