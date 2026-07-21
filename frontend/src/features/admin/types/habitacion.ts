export interface ImagenHabitacion {
  url_imagen: string;
}

export interface Habitacion {
  id_habitacion?: number;
  nombre: string;
  precio_noche: number;
  capacidad: number;
  descripcion?: string;
  // Ahora definimos que es un array de objetos, no de strings
  imagenes: ImagenHabitacion[]; 
}

export interface PaqueteTuristico {
  id?: number;
  nombre: string;
  descripcion: string;
  precio: number;
  cupo_maximo: number;
  fecha_salida: string;
}