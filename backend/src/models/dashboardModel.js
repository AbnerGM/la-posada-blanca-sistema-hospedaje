const { pool } = require('../config/db'); 

const DashboardModel = {
  getKPIs: async () => {
    try {
      const [ingresosRows] = await pool.execute(`
        SELECT SUM(total) as ingresosMensuales 
        FROM reserva 
        WHERE MONTH(fecha_creacion) = MONTH(CURDATE()) 
          AND YEAR(fecha_creacion) = YEAR(CURDATE()) 
          AND estado IN ('confirmada', 'pago_en_revision')
      `);

      const [ocupacionRows] = await pool.execute(`
        SELECT 
          (SELECT COUNT(DISTINCT dr.id_habitacion) 
           FROM detallereserva dr
           INNER JOIN reserva r ON dr.id_reserva = r.id_reserva
           WHERE CURDATE() BETWEEN r.fecha_entrada AND r.fecha_salida 
             AND r.estado IN ('confirmada', 'pago_en_revision')
          ) / NULLIF((SELECT COUNT(*) FROM habitacion WHERE eliminado = 0), 0) * 100 as ocupacionActual
      `);

      const [activasRows] = await pool.execute(`
        SELECT COUNT(*) as reservasActivas 
        FROM reserva 
        WHERE estado IN ('confirmada', 'pago_en_revision', 'pendiente') 
          AND fecha_salida >= CURDATE()
      `);

      const [checkinsRows] = await pool.execute(`
        SELECT COUNT(*) as checkInsHoy 
        FROM reserva 
        WHERE fecha_entrada = CURDATE() 
          AND estado IN ('confirmada', 'pago_en_revision')
      `);

      return {
        ingresosMensuales: parseFloat(ingresosRows[0]?.ingresosMensuales) || 0,
        ocupacionActual: Math.round(parseFloat(ocupacionRows[0]?.ocupacionActual)) || 0,
        reservasActivas: parseInt(activasRows[0]?.reservasActivas) || 0,
        checkInsHoy: parseInt(checkinsRows[0]?.checkInsHoy) || 0
      };
    } catch (error) {
      throw error;
    }
  },

  getVentasData: async () => {
    try {
      const [rows] = await pool.execute(`
        SELECT 
          MONTH(fecha_creacion) as mes,
          SUM(total) as ingresos
        FROM reserva 
        WHERE fecha_creacion >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH) 
          AND estado IN ('confirmada', 'pago_en_revision')
        GROUP BY MONTH(fecha_creacion), YEAR(fecha_creacion)
        ORDER BY YEAR(fecha_creacion) ASC, MONTH(fecha_creacion) ASC
      `);
      
      const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Set', 'Oct', 'Nov', 'Dic'];

      return rows.map(r => ({
        name: meses[r.mes - 1] || 'Mes',
        ingresos: parseFloat(r.ingresos) || 0
      }));
    } catch (error) {
      throw error;
    }
  },

  getReservasData: async () => {
    try {
      const [rows] = await pool.execute(`
        SELECT 
          WEEKDAY(fecha_creacion) as dia,
          COUNT(*) as cantidad
        FROM reserva
        WHERE YEARWEEK(fecha_creacion, 1) = YEARWEEK(CURDATE(), 1)
        GROUP BY WEEKDAY(fecha_creacion)
        ORDER BY WEEKDAY(fecha_creacion) ASC
      `);

      const dias = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

      return rows.map(r => ({
        name: dias[r.dia] || 'Día',
        cantidad: parseInt(r.cantidad) || 0
      }));
    } catch (error) {
      throw error;
    }
  }
};

module.exports = DashboardModel;