const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 3308, 
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'BDPosadaBlanca',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const pruebaConect = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Conectado exitosamente a la base de datos MySQL en el puerto 3308');
        connection.release();
        return pool;
    } catch (error) {
        console.error('❌ ERROR CRÍTICO:');
        console.error('Puerto configurado:', process.env.DB_PORT);
        console.error('Mensaje:', error.message);
        process.exit(1);
    }
};

module.exports = { pool, pruebaConect };