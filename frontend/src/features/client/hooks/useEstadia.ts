import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { obtenerHabitacionesDisponibles } from '../services/estadiaService';
import type { Habitacion } from '../types/estadia';

interface FiltrosBusqueda {
  fechaEntrada?: string;
  fechaSalida?: string;
  capacidad?: number; // Añadido
}

export const useHabitaciones = (filtros?: FiltrosBusqueda) => {
  const [data, setData] = useState<Habitacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        setError(null); 
        
        const datosReales = await obtenerHabitacionesDisponibles(
          filtros?.fechaEntrada, 
          filtros?.fechaSalida,
          filtros?.capacidad // Pasamos el nuevo parámetro
        );
        
        // --- Validación: Si no hay resultados ---
        if (datosReales.length === 0) {
          Swal.fire({
            icon: 'info',
            title: 'Sin disponibilidad',
            text: 'No encontramos habitaciones que coincidan con tus fechas y capacidad. Por favor, intenta con otros criterios.',
            confirmButtonColor: '#051911'
          });
        }
        
        setData(datosReales);
      } catch (err: any) {
        const mensajeError = err.response?.data?.message || "Ocurrió un error inesperado.";
        setError(mensajeError);
        
        Swal.fire({
          icon: 'error',
          title: 'Error de conexión',
          text: mensajeError,
          confirmButtonColor: '#051911'
        });
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
    // Añadimos capacidad a las dependencias para que se dispare al cambiar
  }, [filtros?.fechaEntrada, filtros?.fechaSalida, filtros?.capacidad]);

  return { data, loading, error };
};