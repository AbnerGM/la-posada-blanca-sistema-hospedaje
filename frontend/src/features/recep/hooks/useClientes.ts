import { useState, useEffect } from 'react';
import { fetchListaClientes } from '../services/recepService';
import type { ClienteResumen } from '../types/recep';

export const useClientes = () => {
  const [clientes, setClientes] = useState<ClienteResumen[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const cargarClientes = async () => {
    try {
      setLoading(true);
      const data = await fetchListaClientes();
      setClientes(data || []);
    } catch (err) {
      console.error("Error al cargar lista de clientes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarClientes();
  }, []);

  return { clientes, loading, refresh: cargarClientes };
};