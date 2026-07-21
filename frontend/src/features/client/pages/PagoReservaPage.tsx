import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import cliente from '../../../api/apiClient';

interface CuentaPago {
  tipo: 'yape' | 'transferencia';
  titular: string | null;
  numero: string | null;
  banco: string | null;
  cci: string | null;
  url_qr: string | null;
}

export const PagoReservaPage = () => {
  const { id_reserva } = useParams();
  const [metodoPago, setMetodoPago] = useState('');
  const [comprobante, setComprobante] = useState<File | null>(null);
  const [cuentas, setCuentas] = useState<CuentaPago[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const cargarCuentas = async () => {
      try {
        // CORREGIDO: URL directa de tu proyecto La Posada Blanca
        const res = await fetch('https://laposadablanca.duckdns.org:3000/api/cuentas-pago');
        const data = await res.json();
        setCuentas(data.cuentas || []);
      } catch (error) {
        console.error('Error al cargar cuentas de pago:', error);
      }
    };
    cargarCuentas();
  }, []);

  const yape = cuentas.find(c => c.tipo === 'yape');
  const transferencia = cuentas.find(c => c.tipo === 'transferencia');
  
  const handleEnviarComprobante = async () => {
    if (!metodoPago) {
      Swal.fire('Selecciona un método de pago', '', 'warning');
      return;
    }

    if (!comprobante) {
      Swal.fire('Sube tu comprobante', 'Debes adjuntar una imagen o PDF del pago.', 'warning');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('id_reserva', id_reserva || '');
      formData.append('metodo_pago', metodoPago);
      formData.append('monto', '80');
      formData.append('comprobante', comprobante);

      const res = await cliente.post('/pagos', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Comprobante enviado',
          text: 'Tu pago quedó en revisión.',
          confirmButtonColor: '#051911',
        }).then(() => {
          navigate('/perfil');
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo enviar el comprobante.',
        confirmButtonColor: '#051911',
      });
    }
  };

  return (
    <div className="min-h-screen pt-32 px-6 bg-[#FAF9F6]">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow p-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Opciones de pago
        </h1>

        <p className="text-slate-600 mb-6">
          Reserva N° {id_reserva}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <button
            type="button"
            onClick={() => setMetodoPago('yape')}
            className={`border rounded-2xl p-5 text-left hover:border-slate-900 ${
              metodoPago === 'yape' ? 'border-slate-900 bg-slate-50' : ''
            }`}
          >
            <h2 className="font-bold text-slate-900">Yape</h2>
            <p className="text-sm text-slate-500">Paga escaneando el QR.</p>
          </button>

          <button
            type="button"
            onClick={() => setMetodoPago('transferencia')}
            className={`border rounded-2xl p-5 text-left hover:border-slate-900 ${
              metodoPago === 'transferencia' ? 'border-slate-900 bg-slate-50' : ''
            }`}
          >
            <h2 className="font-bold text-slate-900">Transferencia bancaria</h2>
            <p className="text-sm text-slate-500">Paga desde tu banco.</p>
          </button>
        </div>

        {metodoPago === 'yape' && yape && (
          <div className="bg-[#FAF9F6] rounded-2xl p-5 border border-slate-100">
            <h3 className="font-bold text-slate-900 mb-2">Pago por Yape</h3>

            <p className="text-sm text-slate-600">Número: {yape.numero}</p>
            <p className="text-sm text-slate-600 mb-4">Titular: {yape.titular}</p>

            <div className="flex justify-center">
              <img
                src={yape.url_qr || '/YAPE-QR.png'}
                alt="QR Yape"
                className="w-52 h-52 object-contain border rounded-xl bg-white p-2"
              />
            </div>

            <p className="text-sm text-slate-600 mt-4 text-center">
              Escanea el código QR con Yape y luego sube tu comprobante.
            </p>
          </div>
        )}

        {metodoPago === 'transferencia' && transferencia && (
          <div className="bg-[#FAF9F6] rounded-2xl p-5 border border-slate-100">
            <h3 className="font-bold text-slate-900 mb-2">Transferencia bancaria</h3>
            <p className="text-sm text-slate-600">Banco: {transferencia.banco}</p>
            <p className="text-sm text-slate-600">Cuenta: {transferencia.numero}</p>
            <p className="text-sm text-slate-600">CCI: {transferencia.cci}</p>
            <p className="text-sm text-slate-600">Titular: {transferencia.titular}</p>
            <p className="text-sm text-slate-600 mt-3">
              Luego de realizar la transferencia, sube tu comprobante.
            </p>
          </div>
        )}

        {metodoPago && (
          <div className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Subir comprobante de pago
              </label>

              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    setComprobante(e.target.files[0]);
                  }
                }}
                className="w-full border border-slate-200 rounded-2xl p-3 text-sm"
              />
            </div>

            <button
              type="button"
              onClick={handleEnviarComprobante}
              className="w-full bg-[#051911] hover:bg-black text-white py-4 rounded-2xl font-bold text-sm transition"
            >
              Enviar comprobante
            </button>
          </div>
        )}
      </div>
    </div>
  );
};