const Blog = require('../models/blog.model');

exports.getPosts = (req, res) => {
  Blog.getAll((err, results) => {
    if (err) {
      console.error("Error en Blog.getAll:", err);
      return res.status(500).json({ 
        success: false, 
        message: 'Error al obtener las historias del blog' 
      });
    }
    res.json({ success: true, data: results || [] });
  });
};

exports.crearPost = (req, res) => {
  const { titulo, contenido, imagen, id_categoria } = req.body;
  if (!titulo || !contenido || !id_categoria) {
    return res.status(400).json({ success: false, message: 'Faltan campos obligatorios' });
  }

  Blog.create(req.body, (err, result) => {
    if (err) {
      console.error("Error en Blog.create:", err);
      return res.status(500).json({ 
        success: false, 
        message: 'No se pudo crear el post' 
      });
    }
    res.status(201).json({ success: true, message: 'Post creado con éxito' });
  });
};