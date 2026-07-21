// src/admin/components/DashboardStats.tsx
import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useDashboardStats } from '../hooks/useDashboardStats';

export const DashboardStats = () => {
  const { data, loading, error, refetch } = useDashboardStats();

  const descargarExcel = async () => {
    if (!data) return;

    try {
      // Importamos la librería xlsx de forma dinámica
      const XLSX = await import('xlsx');

      // 1. Estructuramos las filas de datos para el reporte
      const filasReporte = [
        ["LA POSADA BLANCA - CONTROL OPERATIVO"],
        [`Fecha de Emisión: ${new Date().toLocaleDateString('es-PE')} ${new Date().toLocaleTimeString('es-PE')}`],
        [], // Fila en blanco para separar
        ["RESUMEN DE INDICADORES (KPIs)"],
        ["Indicador", "Valor Calculado", "Detalle de Auditoría"],
        ["Ingresos Mensuales", `S/ ${data.kpis.ingresosMensuales.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, "Suma en base a reservas confirmadas"],
        ["Ocupación Actual", `${data.kpis.ocupacionActual}%`, "Capacidad comprometida hoy"],
        ["Reservas Activas", data.kpis.reservasActivas, "Vigentes o próximas en sistema"],
        ["Check-Ins de Hoy", data.kpis.checkInsHoy, "Arribos agendados para la fecha"],
        [],
        ["HISTORIAL DE VENTAS MENSUALES"],
        ["Mes / Período", "Ingresos en Soles (S/)"],
        ...data.ventasData.map(v => [v.name, v.ingresos]),
        [],
        ["FLUJO OPERATIVO SEMANAL"],
        ["Día", "Cantidad de Reservas"],
        ...data.reservasData.map(r => [r.name, r.cantidad])
      ];

      // 2. Creamos el libro y la hoja de cálculo de Excel
      const libroContable = XLSX.utils.book_new();
      const hojaMétricas = XLSX.utils.aoa_to_sheet(filasReporte);

      // Ajustamos el ancho de las columnas para que nada salga cortado al abrir el Excel
      hojaMétricas['!cols'] = [
        { wch: 45 }, // Columna A
        { wch: 20 }, // Columna B
        { wch: 40 }  // Columna C
      ];

      // 3. Acoplamos la hoja al libro con un nombre claro
      XLSX.utils.book_append_sheet(libroContable, hojaMétricas, "Métricas Posada Blanca");

      // 4. Forzamos la descarga del archivo en el navegador
      const nombreArchivo = `Reporte-Gerencial-${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(libroContable, nombreArchivo);

    } catch (err) {
      console.error("Error construyendo el archivo Excel:", err);
      alert("No se pudo estructurar el documento Excel en este momento.");
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 border border-gray-200 text-sm text-gray-600 font-medium">
        Sincronizando métricas con el servidor en tiempo real...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded text-sm text-red-800 flex items-center justify-between">
        <div>
          <span className="font-bold">Error de sincronización:</span> {error || 'No se pudo conectar con el pool SQL.'}
        </div>
        <button 
          onClick={refetch}
          className="px-3 py-1 bg-white border border-red-300 text-red-800 text-xs font-semibold rounded hover:bg-gray-50 transition-colors"
        >
          Reintentar Conexión
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 w-full text-gray-900 font-sans antialiased">
      
      {/* ACCIÓN DE DESCARGA EXCEL */}
      <div className="flex justify-end items-center pb-2">
        <button
          onClick={descargarExcel}
          className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold uppercase tracking-wider rounded transition-colors shadow-sm cursor-pointer"
        >
          Descargar Reporte (Excel)
        </button>
      </div>

      {/* DISEÑO ORIGINAL DEL DASHBOARD COMPLETO (Se mantiene intacto) */}
      <div className="space-y-6 p-6 bg-white border border-gray-200 shadow-sm rounded-lg">
        
        {/* 1. TARJETAS CON DATA PURA */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Ingresos Mensuales</p>
            <p className="text-2xl font-bold mt-1 text-gray-900">
              S/ {data.kpis.ingresosMensuales.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-xs mt-1 text-gray-400">Suma en base a reservas confirmadas</p>
          </div>

          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Ocupación Actual</p>
            <p className="text-2xl font-bold mt-1 text-gray-900">{data.kpis.ocupacionActual}%</p>
            <p className="text-xs mt-1 text-gray-400">Capacidad comprometida hoy</p>
          </div>

          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Reservas Activas</p>
            <p className="text-2xl font-bold mt-1 text-gray-900">{data.kpis.reservasActivas}</p>
            <p className="text-xs mt-1 text-gray-400">Vigentes o próximas en sistema</p>
          </div>

          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Check-Ins de Hoy</p>
            <p className="text-2xl font-bold mt-1 text-gray-900">{data.kpis.checkInsHoy}</p>
            <p className="text-xs mt-1 text-gray-400">Arribos agendados para la fecha</p>
          </div>
        </div>

        {/* 2. GRÁFICOS REALES EN PARALELO */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-4 rounded-lg border border-gray-200 bg-white">
            <div className="mb-4">
              <h3 className="font-bold text-xs uppercase tracking-wider text-gray-800">Evolución Comercial (Mensual)</h3>
            </div>
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.ventasData} margin={{ top: 5, right: 15, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: '#4b5563', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#4b5563', fontSize: 11 }} />
                  <Tooltip contentStyle={{ fontSize: '12px' }} />
                  <Line type="linear" dataKey="ingresos" stroke="#1e40af" strokeWidth={2.5} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="p-4 rounded-lg border border-gray-200 bg-white">
            <div className="mb-4">
              <h3 className="font-bold text-xs uppercase tracking-wider text-gray-800">Flujo Operativo Semanal</h3>
            </div>
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.reservasData} margin={{ top: 5, right: 15, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: '#4b5563', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#4b5563', fontSize: 11 }} allowDecimals={false} />
                  <Tooltip contentStyle={{ fontSize: '12px' }} />
                  <Bar dataKey="cantidad" fill="#0f766e" barSize={22} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* 3. TABLA DE AUDITORÍA */}
        <div className="rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
            <h3 className="font-bold text-xs uppercase tracking-wider text-gray-800">Desglose Resumido para Gerencia</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-600 font-bold uppercase border-b border-gray-200">
                  <th className="py-2 px-4">Indicador Operativo del Hotel</th>
                  <th className="py-2 px-4 text-right">Métricas Registradas</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="py-2.5 px-4 font-medium text-gray-700">Porcentaje Real de Habitaciones Alquiladas Hoy</td>
                  <td className="py-2.5 px-4 text-right font-bold text-blue-700">{data.kpis.ocupacionActual}% de capacidad</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-medium text-gray-700">Arribos Totales Esperados en Recepción Hoy</td>
                  <td className="py-2.5 px-4 text-right font-bold text-gray-900">{data.kpis.checkInsHoy} habitaciones</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-medium text-gray-700">Contratos Activos y Estancias Totales Vigentes</td>
                  <td className="py-2.5 px-4 text-right font-bold text-teal-700">{data.kpis.reservasActivas} transacciones vivas</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};