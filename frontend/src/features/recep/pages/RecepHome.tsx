import { useRecep } from '../hooks/useRecep';
import { HabitacionCard } from '../components/HabitacionCard';
import { RefreshCw, AlertCircle } from 'lucide-react';

export const RecepHome = () => {
  const { habitaciones, loading, error, refresh } = useRecep();

  if (loading) return <div className="p-10 text-center text-slate-500">Cargando panel...</div>;
  
  if (error) return (
    <div className="p-10 text-center text-rose-600 font-bold flex flex-col items-center">
      <AlertCircle className="mb-2" />
      {error} 
      <button onClick={refresh} className="mt-2 text-sm text-slate-600 underline hover:text-slate-900">
        Intentar de nuevo
      </button>
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Panel de Recepción</h1>
          <p className="text-slate-500 text-sm">Monitoreo de estado en tiempo real</p>
        </div>
        <button 
          onClick={refresh}
          className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-sm hover:bg-slate-800 transition active:scale-95"
        >
          <RefreshCw size={16} />
          Actualizar
        </button>
      </div>

      {/* Caso: No hay habitaciones configuradas */}
      {habitaciones.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          No se encontraron habitaciones registradas.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {habitaciones.map((hab) => (
            <HabitacionCard key={hab.id_habitacion} hab={hab} />
          ))}
        </div>
      )}
    </div>
  );
};