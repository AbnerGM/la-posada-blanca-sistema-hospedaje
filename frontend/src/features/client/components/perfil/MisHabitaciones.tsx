import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthGlobal } from '../../../auth/context/AuthContext';
import cliente from '../../../../api/apiClient';

interface Reserva {
  id_reserva: number;
  nombre_habitacion: string;
  fecha_entrada: string;
  fecha_salida: string;
  cantidad_noches: number;
  total: number;
  estado: string;
  fecha_creacion: string;
  estado_pago: string | null;
  metodo_pago: string | null;
}

export const MisHabitaciones = () => {
  const { user } = useAuthGlobal();
  const navigate = useNavigate();
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarReservas = async () => {
      try {
        const res = await cliente.get(`/reservas/mis-reservas/${user?.id}`);
        setReservas(res.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      cargarReservas();
    }
  }, [user]);

  const estadoBadge = (estado: string) => {
    const estilos: Record<string, string> = {
      pendiente_pago: 'bg-amber-100 text-amber-800',
      pago_en_revision: 'bg-blue-100 text-blue-800',
      confirmada: 'bg-emerald-100 text-emerald-800',
      cancelada: 'bg-red-100 text-red-800',
    };
    const textos: Record<string, string> = {
      pendiente_pago: 'Pendiente de pago',
      pago_en_revision: 'Pago en revisión',
      confirmada: 'Confirmada',
      cancelada: 'Cancelada',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${estilos[estado] || 'bg-slate-100 text-slate-600'}`}>
        {textos[estado] || estado}
      </span>
    );
  };

  if (loading) return <div className="text-center p-10 text-primary">Cargando tus estadías...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-serif text-primary">Mis Reservas de Habitación</h2>

      {reservas.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl border border-outline-variant/30 text-center text-on-surface-variant">
          <p>No tienes reservas de habitaciones registradas actualmente.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {reservas.map((reserva) => (
            <div
              key={reserva.id_reserva}
              className="bg-white p-6 rounded-2xl shadow-premium border border-outline-variant/20 flex flex-col md:flex-row justify-between items-center gap-4 transition-all hover:border-primary/20"
            >
              <div className="flex-1 w-full">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-primary font-serif">{reserva.nombre_habitacion}</h3>
                  <span className="text-xs text-on-surface-variant">#{reserva.id_reserva}</span>
                </div>

                <div className="flex flex-col md:flex-row gap-x-6 gap-y-2 mt-3 text-sm">
                  <p className="text-on-surface-variant">
                    Entrada: <span className="font-bold text-on-surface">{new Date(reserva.fecha_entrada).toLocaleDateString('es-PE')}</span>
                  </p>
                  <p className="text-on-surface-variant">
                    Salida: <span className="font-bold text-on-surface">{new Date(reserva.fecha_salida).toLocaleDateString('es-PE')}</span>
                  </p>
                  <p className="text-on-surface-variant">
                    Noches: <span className="font-bold text-on-surface">{reserva.cantidad_noches}</span>
                  </p>
                  <p className="text-on-surface-variant">
                    Total: <span className="font-bold text-on-surface">S/ {Number(reserva.total).toFixed(2)}</span>
                  </p>
                </div>

                <div className="mt-3">{estadoBadge(reserva.estado)}</div>
              </div>

              {reserva.estado === 'pendiente_pago' && (
                <button
                  onClick={() => navigate(`/pago/${reserva.id_reserva}`)}
                  className="bg-primary hover:bg-primary-light text-white px-6 py-2 rounded-xl font-bold text-sm transition-colors shadow-premium whitespace-nowrap"
                >
                  Pagar ahora →
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};