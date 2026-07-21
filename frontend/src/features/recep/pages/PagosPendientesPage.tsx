import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import cliente from '../../../api/apiClient';

interface PagoPendiente {
  id_pago: number;
  id_reserva: number;
  monto: number;
  metodo_pago: string;
  estado: string;
  comprobante: string;
  fecha_pago: string;
  fecha_entrada: string;
  fecha_salida: string;
  nombre: string;
}

export const PagosPendientesPage = () => {
  const [pagos, setPagos] = useState<PagoPendiente[]>([]);
  const [loading, setLoading] = useState(true);

  const cargarPagos = async () => {
    try {
      const res = await cliente.get('/pagos/pendientes');
      setPagos(res.data.pagos || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarPagos();
    const intervalo = setInterval(() => {
      cargarPagos();
    }, 15000);

    return () => clearInterval(intervalo);
  }, []);

  const aprobarPago = async (idPago: number) => {
    const confirmacion = await Swal.fire({
      title: '¿Aprobar pago?',
      text: 'La reserva pasará a estado confirmado.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, aprobar',
      cancelButtonText: 'Cancelar',
    });

    if (!confirmacion.isConfirmed) return;

    try {
      await cliente.put(`/pagos/${idPago}/aprobar`);

      Swal.fire('Aprobado', 'El pago fue aprobado correctamente.', 'success');

      cargarPagos();
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'No se pudo aprobar el pago.', 'error');
    }
  };

  const rechazarPago = async (idPago: number) => {
    const resultado = await Swal.fire({
      title: 'Motivo de rechazo',
      input: 'textarea',
      inputPlaceholder: 'Ejemplo: El comprobante no es legible',
      showCancelButton: true,
      confirmButtonText: 'Rechazar pago',
      cancelButtonText: 'Cancelar',
      inputValidator: (value) => {
        if (!value || value.trim() === '') {
          return 'Debe ingresar un motivo de rechazo.';
        }
      },
    });

    if (!resultado.isConfirmed) return;

    try {
      await cliente.put(`/pagos/${idPago}/rechazar`, {
        motivo_rechazo: resultado.value,
      });

      Swal.fire('Rechazado', 'El pago fue rechazado correctamente.', 'success');

      cargarPagos();
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'No se pudo rechazar el pago.', 'error');
    }
  };

  if (loading) {
    return <div className="text-slate-500">Cargando pagos pendientes...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-2">
        Pagos pendientes
      </h1>

      <p className="text-slate-500 mb-6">
        Revisión de comprobantes enviados por los clientes.
      </p>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 text-xs uppercase tracking-wider">
              <th className="px-6 py-4">Cliente</th>
              <th className="px-6 py-4">Reserva</th>
              <th className="px-6 py-4">Método</th>
              <th className="px-6 py-4">Monto</th>
              <th className="px-6 py-4">Comprobante</th>
              <th className="px-6 py-4">Estado</th>
              <th className="px-6 py-4">Acciones</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {pagos.map((pago) => (
              <tr key={pago.id_pago} className="hover:bg-slate-50">
                <td className="px-6 py-4">
                  <div className="font-bold text-slate-800">
                    {pago.nombre} 
                  </div>
                </td>

                <td className="px-6 py-4 font-semibold text-slate-600">
                  #{pago.id_reserva}
                </td>

                <td className="px-6 py-4 capitalize text-slate-600">
                  {pago.metodo_pago}
                </td>

                <td className="px-6 py-4 font-bold text-slate-800">
                  S/ {Number(pago.monto).toFixed(2)}
                </td>

                <td className="px-6 py-4">
                  <a
                    href={`https://laposadablanca.duckdns.org:3000/${pago.comprobante}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 font-bold text-sm hover:underline"
                  >
                    Ver comprobante
                  </a>
                </td>

                <td className="px-6 py-4">
                  <span className="px-3 py-1 rounded-full text-xs font-bold border bg-amber-50 text-amber-700 border-amber-200">
                    En revisión
                  </span>
                </td>

                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => aprobarPago(pago.id_pago)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700"
                    >
                      Aprobar
                    </button>

                    <button
                      onClick={() => rechazarPago(pago.id_pago)}
                      className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-bold hover:bg-red-700"
                    >
                      Rechazar
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {pagos.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                  No hay pagos pendientes.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};