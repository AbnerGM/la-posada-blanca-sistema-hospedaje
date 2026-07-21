import { useState, useRef, useEffect } from 'react';
import { MoreVertical } from 'lucide-react';
import { useReservas } from '../hooks/useReservas';
import type { Reserva } from '../types/recep';

interface Props {
  reservas?: Reserva[];
  loading?: boolean;
  error?: string | null;
}

export const ReservasTable = ({ reservas: propReservas, loading: propLoading, error: propError }: Props) => {
  // Conectamos con el hook. 
  const hookData = useReservas();
  
  // SIEMPRE priorizamos el estado del hook para que el cambio "Optimista" se vea al instante.
  // Si propReservas existe, lo usamos, pero el hook siempre tiene la última palabra.
  const reservas = hookData.reservas.length > 0 ? hookData.reservas : (propReservas || []);
  const loading = hookData.loading;
  const error = hookData.error;

  const [menuAbierto, setMenuAbierto] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuAbierto(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getStatusStyle = (estado: string) => {
    switch (estado.toLowerCase()) {
      case 'confirmada': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'pendiente': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'cancelada': return 'bg-rose-50 text-rose-700 border-rose-200';
      default: return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  if (loading) return <div className="p-4 text-center text-slate-500">Cargando reservas...</div>;
  if (error) return <div className="p-4 text-center text-rose-600">{error}</div>;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 text-xs uppercase tracking-wider">
            <th className="px-6 py-4 font-bold">Nombre del Huésped</th>
            <th className="px-6 py-4 font-bold">Habitación</th>
            <th className="px-6 py-4 font-bold">Fechas</th>
            <th className="px-6 py-4 font-bold">Monto</th>
            <th className="px-6 py-4 font-bold">Estado</th>
            <th className="px-6 py-4 font-bold text-center">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {reservas.map((res) => (
            <tr key={res.id_reserva} className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4">
                <div className="font-bold text-slate-800">{res.nombre_usuario}</div>
                <div className="text-xs text-slate-500">{res.correo}</div>
              </td>
              <td className="px-6 py-4 font-semibold text-slate-600">{res.nombre_habitacion}</td>
              <td className="px-6 py-4 text-sm text-slate-500">
                {new Date(res.fecha_entrada).toLocaleDateString()} - {new Date(res.fecha_salida).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 font-bold text-slate-800">S/ {parseFloat(res.monto_total).toFixed(2)}</td>
              <td className="px-6 py-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold border capitalize ${getStatusStyle(res.estado)}`}>
                  {res.estado}
                </span>
              </td>
              <td className="px-6 py-4 text-center relative" ref={menuAbierto === res.id_reserva ? (el) => { if (el) menuRef.current = el; } : null}>
                <button 
                  onClick={() => setMenuAbierto(menuAbierto === res.id_reserva ? null : res.id_reserva)}
                  className="text-slate-400 hover:text-slate-600 p-2 transition-colors"
                >
                  <MoreVertical size={18} />
                </button>

                {menuAbierto === res.id_reserva && res.estado.toLowerCase() !== 'cancelada' && (
                  <div className="absolute right-12 top-2 bg-white border border-slate-200 rounded-lg shadow-xl z-50 w-40 py-2">
                    <button 
                      onClick={() => {
                        hookData.handleCancelar(res.id_reserva);
                        setMenuAbierto(null);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 font-bold transition-colors"
                    >
                      Cancelar Reserva
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};