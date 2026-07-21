import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthGlobal } from '../../auth/context/AuthContext';
import cliente from '../../../api/apiClient';

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

export const MisReservasPage = () => {

    const { user } = useAuthGlobal();
    const navigate = useNavigate();
    const [reservas, setReservas] = useState<Reserva[]>([]);

    useEffect(() => {

        const cargarReservas = async () => {
            try {

                const res = await cliente.get(`/reservas/mis-reservas/${user?.id}`);

                setReservas(res.data.data);

            } catch (error) {
                console.error(error);
            }
        };

        if (user) {
            cargarReservas();
        }

    }, [user]);

    return (
  <div>
    <h1 className="text-2xl font-bold text-slate-800 mb-2">
      Mis Reservas
    </h1>

    <p className="text-slate-500 mb-6">
      Consulta el estado de todas tus reservas.
    </p>

    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 text-xs uppercase tracking-wider">
            <th className="px-6 py-4">Reserva</th>
            <th className="px-6 py-4">Habitación</th>
            <th className="px-6 py-4">Entrada</th>
            <th className="px-6 py-4">Salida</th>
            <th className="px-6 py-4 text-center">Noches</th>
            <th className="px-6 py-4">Total</th>
            <th className="px-6 py-4">Estado</th>
            <th className="px-6 py-4">Acción</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {reservas.map((reserva) => (
            <tr key={reserva.id_reserva} className="hover:bg-slate-50">

              <td className="px-6 py-4 font-semibold text-slate-700">
                #{reserva.id_reserva}
              </td>

              <td className="px-6 py-4">
                {reserva.nombre_habitacion}
              </td>

              <td className="px-6 py-4">
                {new Date(reserva.fecha_entrada).toLocaleDateString()}
              </td>

              <td className="px-6 py-4">
                {new Date(reserva.fecha_salida).toLocaleDateString()}
              </td>

              <td className="px-6 py-4 text-center font-semibold">
                {reserva.cantidad_noches}
              </td>

              <td className="px-6 py-4 font-bold">
                S/ {Number(reserva.total).toFixed(2)}
              </td>

              <td className="px-6 py-4">

                    {reserva.estado === 'pendiente_pago' && (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700">
                        Pendiente de pago
                        </span>
                    )}

                    {reserva.estado === 'pago_en_revision' && (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
                        Pago en revisión
                        </span>
                    )}

                    {reserva.estado === 'confirmada' && (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                        Confirmada
                        </span>
                    )}

                    {reserva.estado === 'cancelada' && (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">
                        Cancelada
                        </span>
                    )}

                    </td>

              <td className="px-6 py-4">
                    {reserva.estado === 'pendiente_pago' && (
                        <button
                        onClick={() => navigate(`/pago/${reserva.id_reserva}`)}
                        className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700"
                        >
                        Pagar ahora
                        </button>
                    )}

                    {reserva.estado === 'pago_en_revision' && (
                        <span className="text-xs font-semibold text-blue-600">
                        Estamos revisando tu comprobante
                        </span>
                    )}

                    {reserva.estado === 'confirmada' && (
                        <span className="text-xs font-semibold text-green-600">
                        Reserva lista
                        </span>
                    )}

                    {reserva.estado === 'cancelada' && (
                        <span className="text-xs font-semibold text-red-500">
                        Sin acciones
                        </span>
                    )}
              </td>
            </tr>
          ))}

          {reservas.length === 0 && (
            <tr>
              <td colSpan={7} className="text-center py-8 text-slate-500">
                No tienes reservas registradas.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);
};