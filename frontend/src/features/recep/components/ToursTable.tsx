import { useState } from 'react';
import { useTurismo } from '../hooks/useTurismo';
import { NuevoTourModal } from './NuevoTourModal';

export const ToursTable = () => {
  // Usamos el hook que creamos para obtener los tours
  const { tours, loading, error, refresh } = useTurismo();
  const [selectedTour, setSelectedTour] = useState<{ id_paquete: number; nombre: string; precio: number } | null>(null);

  if (loading) return <div className="p-4 text-center text-slate-500">Cargando tours...</div>;
  if (error) return <div className="p-4 text-center text-rose-600">{error}</div>;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 text-xs uppercase tracking-wider">
            <th className="px-6 py-4 font-bold">Tipo de Tour</th>
            <th className="px-6 py-4 font-bold text-center">Disponibles</th>
            <th className="px-6 py-4 font-bold text-right">Precio</th>
            <th className="px-6 py-4 font-bold text-center">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {tours.map((tour) => (
            <tr key={tour.id_paquete} className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4 font-bold text-slate-800">{tour.nombre}</td>
              <td className="px-6 py-4 text-center">
                <span className="font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                  {tour.cupo_disponible} Tour
                </span>
              </td>
              <td className="px-6 py-4 font-bold text-slate-800 text-right">
                S/ {parseFloat(tour.precio.toString()).toFixed(2)}
              </td>
              <td className="px-6 py-4 text-center">
                <button
                  onClick={() => setSelectedTour({ id_paquete: tour.id_paquete, nombre: tour.nombre, precio: Number(tour.precio) })}
                  disabled={tour.cupo_disponible <= 0}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition active:scale-95 ${
                    tour.cupo_disponible > 0
                      ? 'bg-slate-900 text-white hover:bg-slate-800'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  Reservar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedTour && (
        <NuevoTourModal
          idPaquete={selectedTour.id_paquete}
          nombrePaquete={selectedTour.nombre}
          precio={selectedTour.precio}
          onClose={() => setSelectedTour(null)}
          onSuccess={refresh}
        />
      )}
    </div>
  );
};