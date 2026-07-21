// admin/pages/AdminHome.tsx
import React from 'react';
import { DashboardStats } from '../components/DashboardStats';

export const AdminHome = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-8 p-4">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">Panel Administrativo</h1>
          <p className="text-slate-500 mt-1">Bienvenido, gestiona tu sistema desde aquí.</p>
        </div>
        <div className="flex gap-3">
          {/* Espacio para acciones globales adicionales si es necesario */}
        </div>
      </header>

      {/* Invoca al componente directo: ya consume e imprime los datos del backend */}
      <DashboardStats />
    </div>
  );
};