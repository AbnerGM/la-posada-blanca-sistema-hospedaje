import { useState, useEffect } from 'react';
import { fetchHistorialCliente } from '../../recep/services/recepService';
import type { HistorialServicio } from '../../recep/types/recep';

export const useMisDatos = (id_usuario: number) => {
  const [data, setData] = useState<HistorialServicio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      if (!id_usuario) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const historial = await fetchHistorialCliente(id_usuario);
        setData(historial);
      } catch (error) {
        console.error('Error al cargar el historial del cliente:', error);
      } finally {
        setLoading(false);
      }
    };

    cargar();
  }, [id_usuario]);

  return { data, loading };
};