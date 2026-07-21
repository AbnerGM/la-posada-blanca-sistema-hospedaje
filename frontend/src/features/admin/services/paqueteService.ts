import type { PaqueteTuristico } from '../types/paquete';

const API_URL = 'https://laposadablanca.duckdns.org:3000/api/turismo';

export const fetchPaquetes = async (): Promise<PaqueteTuristico[]> => {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error('Error al obtener los paquetes');
  
  const result = await response.json();
  
  // Como tu backend devuelve { success: true, data: [...] }
  // devolvemos result.data para que el front tenga el array directo
  return result.data || []; 
};

export const createPaquete = async (paquete: PaqueteTuristico): Promise<any> => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(paquete),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error al crear el paquete');
  }
  
  return await response.json();
};