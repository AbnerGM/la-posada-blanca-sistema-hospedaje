import { useState, useEffect } from 'react';
import type { CuentaPago } from '../types/cuentasPago';
import { manejarSesionExpirada } from '../../../utils/sesion';

// URL de localhost cambiada a la de producción fija con el puerto :3000
const API_URL = 'https://laposadablanca.duckdns.org:3000';

export const CuentasPagoPage = () => {
  const [cuentas, setCuentas] = useState<CuentaPago[]>([]);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState<string | null>(null); // guarda el "tipo" que se esta guardando

  const token = localStorage.getItem('token');

  const cargarCuentas = async () => {
    setCargando(true);
    try {
      const res = await fetch(`${API_URL}/api/cuentas-pago`);
      if (!res.ok) throw new Error('Error al obtener las cuentas de pago');

      const data = await res.json();
      setCuentas(data.cuentas);
    } catch (error) {
      console.error('Error al cargar cuentas de pago:', error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarCuentas();
  }, []);

  // Actualiza un campo especifico de una cuenta, solo en pantalla (todavia no guarda)
  const handleCambiarCampo = (tipo: string, campo: keyof CuentaPago, valor: string) => {
    setCuentas((prev) =>
      prev.map((c) => (c.tipo === tipo ? { ...c, [campo]: valor } : c))
    );
  };

  const handleGuardar = async (cuenta: CuentaPago) => {
    setGuardando(cuenta.tipo);
    try {
      const res = await fetch(`${API_URL}/api/cuentas-pago/${cuenta.tipo}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          titular: cuenta.titular,
          numero: cuenta.numero,
          banco: cuenta.banco,
          cci: cuenta.cci,
          url_qr: cuenta.url_qr,
        }),
      });

      if (res.status === 401 || res.status === 403) {
        return manejarSesionExpirada();
      }
      if (!res.ok) throw new Error('Error al guardar');

      alert('Cuenta actualizada correctamente.');
    } catch (error) {
      console.error('Error al guardar cuenta de pago:', error);
      alert('Ocurrió un error al guardar los cambios.');
    } finally {
      setGuardando(null);
    }
  };

  if (cargando) {
    return <div className="p-6 text-slate-500">Cargando cuentas de pago...</div>;
  }

  const yape = cuentas.find((c) => c.tipo === 'yape');
  const transferencia = cuentas.find((c) => c.tipo === 'transferencia');

  return (
    <div className="p-6 min-h-screen">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Cuentas de Pago</h1>
        <p className="text-slate-500 text-sm mt-1">
          Estos datos son los que ven los clientes al momento de pagar su reserva.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tarjeta Yape */}
        {yape && (
          <div className="border border-slate-200 rounded-2xl bg-white shadow-sm p-6 space-y-4">
            <h2 className="font-bold text-lg text-slate-800">Yape</h2>

            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1">Titular</label>
              <input
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                value={yape.titular || ''}
                onChange={(e) => handleCambiarCampo('yape', 'titular', e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1">Número de Yape</label>
              <input
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                value={yape.numero || ''}
                onChange={(e) => handleCambiarCampo('yape', 'numero', e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1">URL de la imagen del QR</label>
              <input
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                placeholder="https://imagen.com/qr.png o /YAPE-QR.png"
                value={yape.url_qr || ''}
                onChange={(e) => handleCambiarCampo('yape', 'url_qr', e.target.value)}
              />
              {yape.url_qr && (
                <img
                  src={yape.url_qr}
                  alt="Vista previa del QR"
                  className="w-32 h-32 object-contain border rounded-xl bg-slate-50 p-2 mt-3"
                />
              )}
            </div>

            <button
              onClick={() => handleGuardar(yape)}
              disabled={guardando === 'yape'}
              className="w-full bg-blue-600 text-white py-2 rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {guardando === 'yape' ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        )}

        {/* Tarjeta Transferencia */}
        {transferencia && (
          <div className="border border-slate-200 rounded-2xl bg-white shadow-sm p-6 space-y-4">
            <h2 className="font-bold text-lg text-slate-800">Transferencia bancaria</h2>

            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1">Titular</label>
              <input
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                value={transferencia.titular || ''}
                onChange={(e) => handleCambiarCampo('transferencia', 'titular', e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1">Banco</label>
              <input
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                value={transferencia.banco || ''}
                onChange={(e) => handleCambiarCampo('transferencia', 'banco', e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1">Número de cuenta</label>
              <input
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                value={transferencia.numero || ''}
                onChange={(e) => handleCambiarCampo('transferencia', 'numero', e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1">CCI</label>
              <input
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                value={transferencia.cci || ''}
                onChange={(e) => handleCambiarCampo('transferencia', 'cci', e.target.value)}
              />
            </div>

            <button
              onClick={() => handleGuardar(transferencia)}
              disabled={guardando === 'transferencia'}
              className="w-full bg-blue-600 text-white py-2 rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {guardando === 'transferencia' ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};