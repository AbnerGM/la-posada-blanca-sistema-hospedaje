import type{ Habitacion } from '../types/habitacion';

const API_URL = 'https://laposadablanca.duckdns.org:3000/api';

export const habitacionService = {
  async crearHabitacion(datos: Habitacion) {
    // Aquí hacemos la limpieza y transformación profunda
    const payload = {
      ...datos,
      // Filtramos los objetos que tienen URL vacía y creamos la estructura correcta
      imagenes: datos.imagenes
        .filter(img => img.url_imagen && img.url_imagen.trim() !== '')
        .map(img => ({ url_imagen: img.url_imagen.trim() }))
    };

    const response = await fetch(`${API_URL}/habitaciones`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al crear la habitación');
    }
    return await response.json();
  }
};