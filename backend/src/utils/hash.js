const bcrypt = require('bcryptjs');

async function encriptarPassword(password) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
}

async function compararPassword(passwordUsuarioPlano, passwordHasheada) {
    const sonIguales = await bcrypt.compare(passwordUsuarioPlano, passwordHasheada);
    return sonIguales;
}

module.exports = {
    encriptarPassword,
    compararPassword
};