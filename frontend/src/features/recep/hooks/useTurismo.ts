import { useState, useEffect } from 'react';
import { fetchResumenTours } from '../services/recepService'; // Importamos la función que creamos antes
import type { PaqueteTuristico } from '../types/recep'; // Importamos la interfaz

export const useTurismo = () => {
  const [tours, setTours] = useState<PaqueteTuristico[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const cargarTours = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchResumenTours();
      setTours(data);
    } catch (err) {
      setError('No se pudo cargar el resumen de tours');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarTours();
  }, []);

  // Devolvemos los datos y la función refresh para que la UI pueda recargar si quiere
  return { tours, loading, error, refresh: cargarTours };
};