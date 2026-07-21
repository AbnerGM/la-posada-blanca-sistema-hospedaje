const API_URL = 'https://laposadablanca.duckdns.org:3000/api/blog';

export const getPostsPublicos = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error('Error al obtener el blog');
  const result = await response.json();
  return result.data; 
};