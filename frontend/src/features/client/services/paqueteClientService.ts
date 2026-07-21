// client/services/paqueteClientService.ts
const API_URL = 'https://laposadablanca.duckdns.org:3000/api/turismo';

export const getPaquetesPublicos = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error('Error al obtener tours');
  const result = await response.json();
  return result.data; // Retorna el array de tours
};