export interface UsuarioConRol {
  id_usuario: number;
  nombre: string;
  correo: string;
  telefono: string | null;
  estado: string;
  estado_cuenta: string;
  id_rol: number;
  nombre_rol: string;
}