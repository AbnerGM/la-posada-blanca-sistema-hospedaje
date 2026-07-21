import { ResumenHabitacionesTable } from '../components/ResumenHabitacionesTable';

export const ResumenHabitacionesPage = () => {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Resumen de Inventario</h1>
        <p className="text-slate-500 text-sm">Monitoreo de disponibilidad y estado de habitaciones en tiempo real.</p>
      </div>

      {/* Aquí jalas el componente que ya creamos */}
      <ResumenHabitacionesTable />
    </div>
  );
};