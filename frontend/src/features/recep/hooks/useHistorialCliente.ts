import { useState, useEffect } from 'react';
import { fetchHistorialCliente } from '../services/recepService'; 
import type { HistorialServicio } from '../types/recep';

/**
 * Hook para gestionar el historial unificado de servicios (Habitaciones y Tours)
 * @param clientId ID del usuario seleccionado
 */
export const useHistorialCliente = (clientId: number | null) => {
  const [historial, setHistorial] = useState<HistorialServicio[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const cargarHistorial = async () => {
    // Si no hay ID, limpiamos el historial previo
    if (!clientId) {
      setHistorial([]);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Llamada al servicio que definimos anteriormente
      const data = await fetchHistorialCliente(clientId);
      
      // Si la API devuelve null o undefined, aseguramos un array vacío
      setHistorial(data || []);
    } catch (err) {
      setError('No se pudo cargar el historial del cliente');
      console.error('Error en hook useHistorialCliente:', err);
    } finally {
      setLoading(false);
    }
  };

  // Se ejecuta automáticamente cada vez que cambie el clientId
  useEffect(() => {
    cargarHistorial();
  }, [clientId]);

  return { 
    historial, 
    loading, 
    error, 
    refresh: cargarHistorial 
  };
};