// src/utils/formatName.ts

export function obtenerNombreCorto(nombreCompleto: string): string {
  const partes = nombreCompleto.trim().split(' ').filter(Boolean);

  if (partes.length >= 3) {
    return `${partes[0]} ${partes[2]}`; // Primer Nombre + Primer Apellido
  }

  return nombreCompleto; // Si no cumple el formato esperado, lo deja igual
}