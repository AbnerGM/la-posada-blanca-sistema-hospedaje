const axios = require('axios');
require('dotenv').config();

const APIPERU_TOKEN = process.env.APIPERU_TOKEN;

async function verificarDni(req, res) {
    const { dni } = req.params;

    if (!dni || dni.length !== 8) {
        return res.status(400).json({ message: "DNI inválido" });
    }

    try {
        const response = await axios.get(
            `https://apiperu.dev/api/dni/${dni}`,
            {
                headers: { Authorization: `Bearer ${APIPERU_TOKEN}` }
            }
        );

        const data = response.data.data;
        return res.json({
            success: true,
            nombre: data.nombre_completo 
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "DNI no encontrado"
        });
    }
}

module.exports = { verificarDni };