import { useState, useEffect } from 'react';
import { getPaquetesPublicos } from '../services/paqueteClientService';
import type { PaqueteTuristico } from '../types/paquete';

export const usePaquetesPublicos = () => {
  const [tours, setTours] = useState<PaqueteTuristico[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarTours = async () => {
      try {
        setLoading(true);
        const data = await getPaquetesPublicos();
        
        // Verificamos que sea un array antes de guardar
        setTours(Array.isArray(data) ? data : []);
        setError(null);
      } catch (err) {
        console.error("Error al cargar tours públicos:", err);
        setError("No se pudieron cargar las experiencias.");
        setTours([]); // Importante: vaciar si falla
      } finally {
        setLoading(false);
      }
    };

    cargarTours();
  }, []);

  return { tours, loading, error };
};