import { useState, useEffect } from 'react';
import { obtenerPanelRecepcion } from '../services/recepService';
import type { HabitacionRecep } from '../types/recep';

export const useRecep = () => {
  const [habitaciones, setHabitaciones] = useState<HabitacionRecep[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await obtenerPanelRecepcion();
      setHabitaciones(data);
    } catch (err) {
      console.error("Error en useRecep:", err);
      setError("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    cargarDatos(); 
  }, []);

  return { habitaciones, loading, error, refresh: cargarDatos };
};