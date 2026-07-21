import { usePaquetesPublicos } from '../../hooks/usePaquetesPublicos';
import type { PaqueteTuristico } from '../../types/paquete';

export const ListaExperiencias = () => {
  const { tours, loading, error } = usePaquetesPublicos();

  if (loading) return <div className="p-10 text-center text-slate-500">Cargando experiencias...</div>;
  if (error) return <div className="p-10 text-center text-red-500">{error}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8">
      {tours.map((tour: PaqueteTuristico) => (
        <div 
          key={tour.id_paquete} 
          className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-100 transition-transform hover:scale-[1.02]"
        >
          {/* Imagen generativa basada en el ID */}
          <img 
            src={`https://picsum.photos/seed/${tour.id_paquete}/800/600`} 
            alt={tour.nombre}
            className="w-full h-48 object-cover"
          />
          
          <div className="p-6">
            <h3 className="text-xl font-bold text-slate-800">{tour.nombre}</h3>
            <p className="text-slate-500 text-sm mt-2 line-clamp-2">{tour.descripcion}</p>
            
            {/* Detalles técnicos reales */}
            <div className="flex gap-4 mt-4 text-xs text-slate-500 font-semibold uppercase tracking-wider">
              <div className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded">
                 {tour.duracion || '3 días'}
              </div>
              <div className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2 py-1 rounded">
                 {tour.cupo_disponible > 0 ? `${tour.cupo_disponible} cupos` : 'Agotado'}
              </div>
            </div>

            {/* Precio y Acción */}
            <div className="mt-4 flex items-center justify-between">
              <span className="font-bold text-lg text-slate-900">S/ {tour.precio}</span>
              <span className="text-xs text-slate-400">por persona</span>
            </div>
            
            <button className="w-full mt-4 bg-slate-900 text-white py-2 rounded-lg font-bold hover:bg-slate-800 transition-colors">
              Reservar Paquete →
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};