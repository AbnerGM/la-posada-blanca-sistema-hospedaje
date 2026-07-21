import { useState, useRef, useEffect } from 'react';
import type { HistorialServicio } from '../types/recep'; 
import { cancelarReserva, cancelarCompraTour } from '../services/recepService';
import Swal from 'sweetalert2';
import { MoreVertical } from 'lucide-react';

interface Props {
  historial: HistorialServicio[];
  onRefresh: () => void;
}

export const ClientHistoryTable = ({ historial, onRefresh }: Props) => {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const containerRef = useRef<HTMLTableSectionElement>(null);

  // Cerrar menú al hacer clic fuera de la tabla
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCancelar = async (item: HistorialServicio) => {
    setOpenMenuId(null); // Cerramos el menú inmediatamente al elegir
    
    const result = await Swal.fire({
      title: '¿Confirmar cancelación?',
      text: `Vas a cancelar este servicio de ${item.tipo === 'Habitacion' ? 'Habitación' : item.tipo}: ${item.servicio}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Sí, cancelar'
    });

    if (result.isConfirmed) {
      try {
        if (item.tipo === 'Tour') {
          await cancelarCompraTour(item.id_referencia);
        } else {
          await cancelarReserva(item.id_referencia);
        }
        onRefresh(); 
        Swal.fire('¡Cancelado!', 'El servicio ha sido actualizado.', 'success');
      } catch (error) {
        Swal.fire('Error', 'No se pudo procesar la cancelación.', 'error');
      }
    }
  };

  if (!historial || historial.length === 0) {
    return <div className="p-8 text-center text-slate-500 bg-white border border-slate-200 rounded-xl">No hay servicios registrados.</div>;
  }

  return (
    <div className="overflow-visible border border-slate-200 rounded-xl shadow-sm bg-white">
      <table className="w-full text-sm text-left">
        <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold">
          <tr>
            <th className="p-4">Tipo</th>
            <th className="p-4">Servicio</th>
            <th className="p-4">Fecha</th>
            <th className="p-4">Estado</th>
            <th className="p-4 text-center">Acción</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100" ref={containerRef}>
          {historial.map((item, index) => {
            const menuId = `${item.tipo}-${item.id_referencia}-${index}`;
            return (
              <tr key={menuId}>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                    item.tipo === 'Tour' ? 'bg-amber-100 text-amber-700' : 'bg-sky-100 text-sky-700'
                  }`}>
                    {item.tipo === 'Habitacion' ? 'Habitación' : item.tipo}
                  </span>
                </td>
                <td className="p-4 font-medium text-slate-700">{item.servicio}</td>
                <td className="p-4 text-slate-500">{new Date(item.fecha).toLocaleDateString('es-PE')}</td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                    item.estado === 'confirmada' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {item.estado.toUpperCase()}
                  </span>
                </td>
                <td className="p-4 text-center relative">
                  {item.estado !== 'cancelada' && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation(); // Evita que se cierre al hacer clic
                        setOpenMenuId(openMenuId === menuId ? null : menuId);
                      }}
                      className="text-slate-400 hover:text-slate-700 transition-colors p-2"
                    >
                      <MoreVertical size={18} />
                    </button>
                  )}
                  {/* Menú desplegable */}
                  {openMenuId === menuId && (
                    <div className="absolute right-12 top-2 z-50 bg-white border border-slate-200 rounded-lg shadow-xl w-32 py-1">
                      <button 
                        onClick={() => handleCancelar(item)}
                        className="w-full text-left px-4 py-2 text-[12px] text-red-600 hover:bg-red-50 transition"
                      >
                        Cancelar
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};