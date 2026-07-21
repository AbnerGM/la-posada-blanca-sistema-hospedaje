// admin/hooks/useDashboardStats.ts
import { useState, useEffect } from 'react';
import { dashboardService } from '../services/dashboardService';
import type{ DashboardResponse } from '../types/dashboard';

export const useDashboardStats = () => {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await dashboardService.getStats();
      if (res.success) {
        setData(res);
      } else {
        setError(res.message || 'No se pudieron recuperar las estadísticas.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error de conexión con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return { data, loading, error, refetch: fetchStats };
};