const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs'); // Añadido para leer certificados
const https = require('https'); // Añadido para crear servidor seguro
const { pruebaConect } = require('./src/config/db');

// Autenticación
const authRoutes = require('./src/routes/auth.routes');
// Habitaciones
const habitacionRoutes = require('./src/routes/habitacion.routes');
// Nueva ruta de Recepción
const recepRoutes = require('./src/routes/recep.routes'); 

const reservaRoutes = require('./src/routes/reserva.routes');
const turismoRecepRoutes = require('./src/routes/turismoRecepRoutes');
const blogRoutes = require('./src/routes/blog.routes');
const pagoRoutes = require('./src/routes/pago.routes');
// 🆕 Roles y Permisos
const rolPermisoRoutes = require('./src/routes/rolPermiso.routes');
const personalRoutes = require('./src/routes/personal.routes');
const historialRoutes = require('./src/routes/historial.routes');
const cuentasPagoRoutes = require('./src/routes/cuentasPago.routes');
const dashboardRoutes = require('./src/routes/dashboardRoutes');

require('dotenv').config();

const app = express();

// Configuración de CORS
app.use(cors({
    origin: 'https://laposadablanca.duckdns.org', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

// Middlewares globales
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Enlazamos rutas
app.use('/api/auth', authRoutes);
app.use('/api', habitacionRoutes);
app.use('/api/recep', recepRoutes); 
app.use('/api/reservas', reservaRoutes);
app.use('/api/pagos', pagoRoutes);
app.use('/api/recep/tours', turismoRecepRoutes);
app.use('/api/turismo', turismoRecepRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/roles-permisos', rolPermisoRoutes);
app.use('/api/personal', personalRoutes);
app.use('/api/historial', historialRoutes);
app.use('/api/cuentas-pago', cuentasPagoRoutes);
app.use('/api/dashboard', dashboardRoutes);

const PORT = process.env.PORT || 3000;

// Configuración de certificados SSL de Hestia
const options = {
  key: fs.readFileSync('/home/posada/conf/web/laposadablanca.duckdns.org/ssl/laposadablanca.duckdns.org.key'),
  cert: fs.readFileSync('/home/posada/conf/web/laposadablanca.duckdns.org/ssl/laposadablanca.duckdns.org.crt')
};

// Función asíncrona para arrancar el servidor
async function iniciarServidor() {
    try {
        await pruebaConect();
        
        // Servidor HTTPS
        https.createServer(options, app).listen(PORT, () => {
            console.log(`Servidor HTTPS activo en: https://laposadablanca.duckdns.org:${PORT}`);
        });
    } catch (error) {
        console.error('No se pudo iniciar el servidor debido a un fallo en la BD:', error.message);
        process.exit(1);
    }
}

iniciarServidor();