import { Bed, AlertTriangle, RefreshCw, CheckCircle, User, Clock, CalendarDays } from 'lucide-react';
import type { HabitacionRecep } from '../types/recep';

export const HabitacionCard = ({ hab }: { hab: HabitacionRecep }) => {
  
  const formatearFecha = (fechaStr: string | null) => {
    if (!fechaStr) return "";
    return fechaStr.split(' al ').map(f => {
      const d = new Date(f);
      // Ajuste para evitar desfase de zona horaria al crear la fecha
      return `${String(d.getUTCDate()).padStart(2, '0')}/${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
    }).join(' - ');
  };

  const formatearFechaSimple = (fechaStr: string | null | undefined) => {
    if (!fechaStr) return "";
    const d = new Date(fechaStr);
    return `${String(d.getUTCDate()).padStart(2, '0')}/${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
  };

  const esReservaActiva = () => {
    if (!hab.fechas) return false;
    const [inicioStr, finStr] = hab.fechas.split(' al ');
    
    const fechaInicio = new Date(inicioStr);
    const fechaFin = new Date(finStr);
    const hoy = new Date();
    
    // Reseteamos horas para comparar solo fechas
    fechaInicio.setUTCHours(0,0,0,0);
    fechaFin.setUTCHours(23,59,59,999);
    hoy.setUTCHours(12,0,0,0); // Mediodía de hoy

    // Es activa si hoy está entre el inicio y el fin
    return hoy >= fechaInicio && hoy <= fechaFin;
  };

  const getStyles = () => {
    if (hab.estado_reserva === 'confirmada') return 'bg-blue-50 border-blue-200 text-blue-700';
    if (hab.estado_reserva === 'pendiente') return 'bg-amber-50 border-amber-200 text-amber-700';
    if (hab.estado_operativo === 'mantenimiento') return 'bg-rose-50 border-rose-200 text-rose-700';
    if (hab.estado_operativo === 'limpieza') return 'bg-amber-50 border-amber-200 text-amber-700';
    return 'bg-emerald-50 border-emerald-200 text-emerald-700';
  };

  return (
    <div className={`border p-5 rounded-2xl ${getStyles()} transition-all hover:shadow-md flex flex-col justify-between h-full`}>
      <div>
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold">{hab.nombre}</h3>
            <p className="text-[10px] font-bold uppercase opacity-60">S/. {hab.precio_noche} / noche</p>
          </div>
          <Bed size={20} className="opacity-70" />
        </div>

        <div className="mt-4 pt-3 border-t border-black/5">
          {/* Usamos !null y comprobamos que fechas exista */}
          {hab.estado_reserva != null && hab.fechas ? (
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 font-bold">
                {hab.estado_reserva === 'confirmada' ? <User size={14} /> : <Clock size={14} />}
                <span className="text-sm truncate">{hab.cliente_reserva || 'Reservado'}</span>
              </div>
              <div className="bg-black/5 rounded px-2 py-1 mt-1">
                <p className="text-[10px] font-bold uppercase text-slate-800">
                  Ocupada hasta:
                </p>
                <p className="text-[10px] font-medium opacity-70">
                  {formatearFecha(hab.fechas)}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
              {hab.estado_operativo === 'disponible' && <CheckCircle size={14} />}
              {hab.estado_operativo === 'mantenimiento' && <AlertTriangle size={14} />}
              {hab.estado_operativo === 'limpieza' && <RefreshCw size={14} className="animate-spin" />}
              <span>{hab.estado_operativo}</span>
            </div>
          )}
        </div>
      </div>

      {/* Próxima reserva si existe */}
      {hab.fecha_entrada_proxima && (
        <div className="mt-4 pt-3 border-t border-dashed border-black/10 flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase opacity-75">
            <CalendarDays size={12} />
            <span>Próxima Reserva:</span>
          </div>
          <div className="bg-black/5 rounded px-2 py-1 text-[10px]">
            <p className="font-semibold truncate">{hab.cliente_proximo || 'Huésped'}</p>
            <p className="opacity-70 font-medium">
              {formatearFechaSimple(hab.fecha_entrada_proxima)} al {formatearFechaSimple(hab.fecha_salida_proxima)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};