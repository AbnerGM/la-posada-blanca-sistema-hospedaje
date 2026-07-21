import { useState, useEffect } from 'react';
import { fetchResumenHabitaciones } from '../services/recepService';
import type { ResumenHabitacion } from '../types/recep';

export const useResumen = () => {
  const [resumen, setResumen] = useState<ResumenHabitacion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const cargarResumen = async () => {
    try {
      setLoading(true);
      setError(null); // Limpiamos errores previos al reintentar
      const data = await fetchResumenHabitaciones();
      setResumen(data);
    } catch (err) {
      setError('No se pudo cargar el resumen de habitaciones');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarResumen();
  }, []);

  return { resumen, loading, error, refresh: cargarResumen };
};