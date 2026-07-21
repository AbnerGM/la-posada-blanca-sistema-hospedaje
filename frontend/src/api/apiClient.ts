import axios from 'axios';

const cliente = axios.create({
  baseURL: 'https://laposadablanca.duckdns.org:3000/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

cliente.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default cliente;