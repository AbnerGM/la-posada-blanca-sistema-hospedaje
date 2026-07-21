// admin/services/dashboardService.ts
import type{ DashboardResponse } from '../types/dashboard';

const API_URL = 'https://laposadablanca.duckdns.org:3000/api'; // Ajusta al puerto real de tu backend

export const dashboardService = {
  getStats: async (): Promise<DashboardResponse> => {
    const response = await fetch(`${API_URL}/dashboard/stats`);
    if (!response.ok) {
      throw new Error('Error al conectar con las métricas del servidor');
    }
    return response.json();
  }
};