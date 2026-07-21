import { useState, useEffect } from 'react';
import Swal from 'sweetalert2'; 
import { fetchHistorialReservas, cancelarReserva } from '../services/recepService';
import type { Reserva } from '../types/recep';

export const useReservas = () => {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const cargarHistorial = async () => {
    try {
      setLoading(true);
      const data = await fetchHistorialReservas();
      setReservas(data);
    } catch (err) {
      setError('No se pudo cargar el historial de reservas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelar = async (id_reserva: number) => {
    // 1. Mostrar la alerta de confirmación
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "Esta acción cancelará la reserva permanentemente.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e11d48',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Sí, cancelar reserva',
      cancelButtonText: 'Volver'
    });

    if (result.isConfirmed) {
      try {
        // Ejecutamos la petición al servidor
        await cancelarReserva(id_reserva);
        
        // 2. ACTUALIZACIÓN INMEDIATA:
        // Cambiamos el estado local manualmente para que se refleje al instante
        setReservas((prev) => 
          prev.map((res) => 
            res.id_reserva === id_reserva 
              ? { ...res, estado: 'cancelada' } 
              : res
          )
        );
        
        // 3. Notificación de éxito
        await Swal.fire('Cancelada', 'La reserva ha sido cancelada correctamente.', 'success');
        
      } catch (err) {
        console.error("Error al cancelar:", err);
        Swal.fire('Error', 'No se pudo cancelar la reserva. Intenta de nuevo.', 'error');
        // Si falla, recargamos por si acaso el estado en BD es diferente
        cargarHistorial();
      }
    }
  };

  useEffect(() => {
    cargarHistorial();
  }, []);

  return { reservas, loading, error, refresh: cargarHistorial, handleCancelar };
};