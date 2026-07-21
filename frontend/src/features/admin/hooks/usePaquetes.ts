import { useState, useEffect } from 'react';
import { fetchPaquetes, createPaquete } from '../services/paqueteService';
import type { PaqueteTuristico } from '../types/paquete';
import Swal from 'sweetalert2';

export const usePaquetes = () => {
  const [paquetes, setPaquetes] = useState<PaqueteTuristico[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const cargarPaquetes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await fetchPaquetes();
      
      // SEGURIDAD: Aseguramos que siempre sea un array. 
      // Si fetchPaquetes devuelve undefined o null, inicializamos con []
      setPaquetes(Array.isArray(data) ? data : []);
      
    } catch (err) {
      setError('Error al cargar la lista de paquetes');
      console.error(err);
      setPaquetes([]); // Vaciamos si hay error para evitar que la UI explote
    } finally {
      setLoading(false);
    }
  };

  const agregarPaquete = async (nuevo: PaqueteTuristico) => {
    try {
      setLoading(true);
      await createPaquete(nuevo);
      await cargarPaquetes(); // Refresca la lista automáticamente
      Swal.fire('¡Éxito!', 'Paquete creado correctamente', 'success');
    } catch (err) {
      Swal.fire('Error', 'No se pudo guardar el paquete', 'error');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarPaquetes();
  }, []);

  return { 
    paquetes, 
    loading, 
    error, 
    agregarPaquete, 
    refresh: cargarPaquetes 
  };
};