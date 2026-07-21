export interface Habitacion {
  id_habitacion: number;
  nombre: string;
  precio_noche: number;
  capacidad: number;
  descripcion: string;
  estado: string;
  esta_ocupada: boolean; // <--- AGREGA ESTA LÍNEA
  imagenes?: ImagenHabitacion[];
}

export interface ImagenHabitacion {
  id_imagen: number;
  id_habitacion: number;
  url_imagen: string;
}