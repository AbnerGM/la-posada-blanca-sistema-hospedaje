// src/routes/dashboardRoutes.js
const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

// Definimos el endpoint de las estadísticas
router.get('/stats', dashboardController.getDashboardStats);

module.exports = router;