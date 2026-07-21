// src/controllers/dashboardController.js
const DashboardModel = require('../models/dashboardModel');

const getDashboardStats = async (req, res) => {
  try {
    const [kpis, ventasData, reservasData] = await Promise.all([
      DashboardModel.getKPIs(),
      DashboardModel.getVentasData(),
      DashboardModel.getReservasData()
    ]);

    return res.status(200).json({
      success: true,
      kpis,
      ventasData,
      reservasData
    });

  } catch (error) {
    // 🔍 ESTA LÍNEA ES CLAVE: Te dirá exactamente qué falló en tu consola de Node (ej: "Unknown column 'fecha_creacion'")
    console.error("ERROR DETALLADO DEL DASHBOARD:", error);
    
    return res.status(500).json({
      success: false,
      message: "Hubo un error interno en el servidor.",
      error: error.message // Te lo envía al front para que lo leas directo en la pestaña Network
    });
  }
};

module.exports = { getDashboardStats };