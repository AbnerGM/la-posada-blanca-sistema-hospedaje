export interface Rol {
  id_rol: number;
  nombre_rol: string;
  es_base: number; 
}

export interface Permiso {
  id_permiso: number;
  clave: string;
  nombre: string;
  categoria: string;
}

export interface Asignacion {
  id_rol: number;
  id_permiso: number;
}

export interface MatrizResponse {
  roles: Rol[];
  permisos: Permiso[];
  asignaciones: Asignacion[];
}