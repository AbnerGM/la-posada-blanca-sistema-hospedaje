import type { HabitacionRecep, Reserva, ResumenHabitacion, PaqueteTuristico, HistorialServicio,ClienteResumen,PerfilCompleto } from '../types/recep';

// 1. Monitoreo actual (Tarjetas visuales)
export const obtenerPanelRecepcion = async (): Promise<HabitacionRecep[]> => {
  const response = await fetch('https://laposadablanca.duckdns.org:3000/api/recep/panel');
  if (!response.ok) throw new Error('Error al obtener datos de recepción');
  const result = await response.json();
  return result.data; 
};

// 2. Historial de reservas (Tabla de reservas)
export const fetchHistorialReservas = async (): Promise<Reserva[]> => {
  const response = await fetch('https://laposadablanca.duckdns.org:3000/api/reservas/historial');
  if (!response.ok) throw new Error('Error al obtener el historial de reservas');
  const result = await response.json();
  return result.data;
};

// 3. CANCELAR RESERVA (Habitaciones)
export const cancelarReserva = async (id_reserva: number): Promise<any> => {
  const response = await fetch(`https://laposadablanca.duckdns.org:3000/api/reservas/${id_reserva}/cancelar`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' }
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Error al cancelar la reserva');
  }
  return await response.json();
};

// 4. CANCELAR TOUR (Tour comprado)
export const cancelarCompraTour = async (id_compra: number): Promise<any> => {
  const response = await fetch(`https://laposadablanca.duckdns.org:3000/api/turismo/compra/${id_compra}/cancelar`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' }
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Error al cancelar el tour');
  }
  return await response.json();
};

// 5. Resumen de habitaciones
export const fetchResumenHabitaciones = async (): Promise<ResumenHabitacion[]> => {
  const response = await fetch('https://laposadablanca.duckdns.org:3000/api/recep/resumen-habitaciones');
  if (!response.ok) throw new Error('Error al obtener el resumen de habitaciones');
  const result = await response.json();
  return result.data; 
};

export const fetchResumenTours = async (): Promise<PaqueteTuristico[]> => {
  const response = await fetch('https://laposadablanca.duckdns.org:3000/api/recep/tours');
  if (!response.ok) throw new Error('Error al obtener el resumen de tours');
  const result = await response.json();
  return result.data;
};

export const postReserva = async (datos: any): Promise<any> => {
  const response = await fetch('https://laposadablanca.duckdns.org:3000/api/reservas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Error al crear la reserva');
  }
  return await response.json();
};

// --- NUEVA FUNCION: Historial Unificado ---
export const fetchHistorialCliente = async (id_usuario: number): Promise<HistorialServicio[]> => {
  const response = await fetch(`https://laposadablanca.duckdns.org:3000/api/turismo/clientes/${id_usuario}/historial`);
  if (!response.ok) throw new Error('Error al obtener el historial unificado del cliente');
  const result = await response.json();
  return result.data;
};

export const fetchListaClientes = async (): Promise<ClienteResumen[]> => {
  const response = await fetch('https://laposadablanca.duckdns.org:3000/api/turismo/clientes/lista');
  if (!response.ok) {
    throw new Error('Error al obtener la lista de clientes');
  }
  const result = await response.json();
  return result.data;
};

export const fetchDatosCompletosUsuario = async (id: number): Promise<PerfilCompleto> => {
  const response = await fetch(`https://laposadablanca.duckdns.org:3000/api/auth/perfil/${id}`);
  
  if (!response.ok) {
    throw new Error('Error al obtener los datos del usuario');
  }
  
  const result = await response.json();
  return result.data; 
};

// PUT: Actualizar solo lo que el usuario quiera cambiar (correo o teléfono)
export const actualizarPerfil = async (
  id: number, 
  datos: { correo?: string; telefono?: string }
) => {
  const response = await fetch(`https://laposadablanca.duckdns.org:3000/api/auth/perfil/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error al actualizar');
  }

  return response.json();
};