const jwt = require('jsonwebtoken');
require('dotenv').config();

async function verificarToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; 

    if (!token) {
        return res.status(401).json({ message: "Acceso denegado. No se proporcionó un token." });
    }

    try {
        const verificado = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = verificado; 
        next();
    } catch (error) {
        return res.status(403).json({ message: "Token inválido o expirado." });
    }
}

async function esAdmin(req, res, next) {
    if (req.usuario && req.usuario.rol === 3) {
        next(); 
    } else {
        return res.status(403).json({ message: "Acceso denegado. Se requieren permisos de Administrador." });
    }
}

module.exports = {
    verificarToken,
    esAdmin
};