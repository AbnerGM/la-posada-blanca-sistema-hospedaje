const bcrypt = require('bcryptjs');

async function generarHashManual() {
    const passwordPlano = "Admin12345";
    
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(passwordPlano, salt);
    

    console.log("ESTE ES TU HASH PARA SQL SERVER:");
    console.log(hash);
}

generarHashManual();