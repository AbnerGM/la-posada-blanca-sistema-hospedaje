// Lo que pide tu Postman de entrada
export interface LoginRequest {
  correo: string;
  contrasena: string;
}

// Lo que devuelve tu Postman al hacer login exitoso
export interface LoginResponse {
  message: string;
  token: string;
  usuario: {
    id: number;
    nombre: string;
    rol: number;
  };
}