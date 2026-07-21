// features/client/services/estadiaService.ts
import cliente from '../../../api/apiClient';
import type { Habitacion } from '../types/estadia';

/**
 * Obtiene las habitaciones disponibles incluyendo el filtro de capacidad.
 */
export const obtenerHabitacionesDisponibles = async (
  fechaEntrada?: string, 
  fechaSalida?: string,
  capacidad?: number // Agregamos este parámetro
): Promise<Habitacion[]> => {
  
  // Enviamos los tres parámetros al backend
  const response = await cliente.get('/habitaciones', {
    params: {
      fechaEntrada,
      fechaSalida,
      capacidad // Ahora se enviará como ?capacidad=X en la URL
    }
  });

  return response.data;
};