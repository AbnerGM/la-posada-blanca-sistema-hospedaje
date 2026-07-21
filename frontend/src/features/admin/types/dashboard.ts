// admin/types/dashboard.ts

export interface DashboardKPIs {
  ingresosMensuales: number;
  ocupacionActual: number;
  reservasActivas: number;
  checkInsHoy: number;
}

export interface VentasDataPoint {
  name: string;
  ingresos: number;
}

export interface ReservasDataPoint {
  name: string;
  cantidad: number;
}

export interface DashboardResponse {
  success: boolean;
  kpis: DashboardKPIs;
  ventasData: VentasDataPoint[];
  reservasData: ReservasDataPoint[];
  message?: string;
}