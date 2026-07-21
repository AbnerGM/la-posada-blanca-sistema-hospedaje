const { pool } = require('../config/db');

const Blog = {
  // Cambiamos a async para usar await
  getAll: async (callback) => {
    try {
      const sql = 'SELECT * FROM blogpost ORDER BY fecha_publicacion DESC';
      const [rows] = await pool.query(sql); // Usamos await aquí
      callback(null, rows); // Pasamos los resultados al callback
    } catch (err) {
      callback(err, null);
    }
  },
  
  create: async (data, callback) => {
    try {
      const sql = 'INSERT INTO blogpost (titulo, contenido, imagen, id_categoria) VALUES (?, ?, ?, ?)';
      const [result] = await pool.query(sql, [data.titulo, data.contenido, data.imagen, data.id_categoria]);
      callback(null, result);
    } catch (err) {
      callback(err, null);
    }
  }
};

module.exports = Blog;