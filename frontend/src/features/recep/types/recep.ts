// --- MÓDULO DE HABITACIONES ---
export interface HabitacionRecep {
  id_habitacion: number;
  nombre: string;
  precio_noche: number;
  estado_operativo: 'disponible' | 'mantenimiento' | 'limpieza';
  estado_reserva: 'confirmada' | 'pendiente' | null;
  cliente_reserva: string | null;
  fechas: string | null;
  imagenes: { url_imagen: string }[];
  cliente_proximo?: string | null;
  fecha_entrada_proxima?: string | null;
  fecha_salida_proxima?: string | null;
  estado_reserva_proxima?: 'confirmada' | 'pendiente' | null;
}

export interface ResumenHabitacion {
  tipo_habitacion: string;
  total_inventario: number;
  disponibles: number;
  en_mantenimiento: number;
  precio: string;
}

// --- MÓDULO DE RESERVAS (HOTEL) ---
export interface Reserva {
  id_reserva: number;
  nombre_usuario: string;
  correo: string;
  nombre_habitacion: string;
  fecha_entrada: string;
  fecha_salida: string;
  monto_total: string;
  estado: 'confirmada' | 'pendiente' | 'cancelada';
}

// --- MÓDULO DE TURISMO ---
// PaqueteTuristico: Datos base del catálogo de tours
export interface PaqueteTuristico {
  id_paquete: number;
  nombre: string;
  descripcion: string;
  precio: number;
  duracion: string;
  cupo_disponible: number;
}

// CompraTour: Datos específicos de la reserva realizada por un usuario
// Usar esta interfaz en tu hook useTurismo.ts para evitar errores de tipado
export interface CompraTour {
  id_compra: number;
  id_paquete: number;      // Necesario para la lógica de cancelación
  nombre: string;          // Nombre del tour
  id_usuario: number;
  fecha_compra: string;
  estado: 'confirmada' | 'cancelada';
}

// Esta es la interfaz del "Puente" que creamos en el UNION ALL
export interface HistorialServicio {
  tipo: 'Tour' | 'Habitacion'; // Para saber qué botón mostrar
  id_referencia: number;      // El ID genérico (id_compra o id_reserva)
  servicio: string;           // Nombre del Tour o Nombre de la Habitación
  fecha: string;              // Fecha de compra o entrada
  estado: 'confirmada' | 'cancelada' | 'pendiente';
}

export interface ClienteResumen {
  id_usuario: number;
  nombre: string;
  tiene_reserva: number; // 0 o mayor (nos dice si tiene reservas hoteleras)
  tiene_tour: number;    // 0 o mayor (nos dice si tiene tours activos)
}

export interface PerfilCompleto {
  id_usuario: number;
  nombre: string;
  correo: string;
  telefono: string;
  id_rol: number;
}