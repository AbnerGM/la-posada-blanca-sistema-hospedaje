// Se llama cuando el backend responde 401 (no autenticado) o 403 (sin permiso/token vencido).
// Limpia la sesión guardada y manda al usuario al login con un aviso claro.
export function manejarSesionExpirada() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('permisos');
  window.location.href = '/auth/login?sesion=expirada';
}