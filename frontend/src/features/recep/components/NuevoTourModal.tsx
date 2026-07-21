import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import cliente from '../../../api/apiClient';
import { X, User, MapPin } from 'lucide-react';

interface Cliente {
  id_usuario: number;
  nombre: string;
  correo: string;
  telefono: string;
}

interface Props {
  idPaquete: number;
  nombrePaquete: string;
  precio: number;
  onClose: () => void;
  onSuccess: () => void;
}

export const NuevoTourModal = ({ idPaquete, nombrePaquete, precio, onClose, onSuccess }: Props) => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [busquedaCliente, setBusquedaCliente] = useState('');
  const [idUsuario, setIdUsuario] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Cargar clientes al montar
  useEffect(() => {
    const cargarClientes = async () => {
      try {
        const res = await cliente.get('/auth/clientes');
        if (res.data && res.data.success) {
          setClientes(res.data.data);
        }
      } catch (error) {
        console.error("Error al cargar clientes:", error);
      }
    };
    cargarClientes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idUsuario) {
      Swal.fire({
        icon: 'warning',
        title: 'Selecciona un cliente',
        text: 'Por favor, selecciona al huésped para registrar la reserva.',
        confirmButtonColor: '#051911'
      });
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        id_usuario: Number(idUsuario),
        id_paquete: idPaquete
      };

      const res = await cliente.post('/recep/tours/reservar', payload);
      if (res.data && res.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Reserva de Tour Exitosa',
          text: 'La reserva del tour ha sido registrada y el cupo descontado.',
          confirmButtonColor: '#051911'
        });
        onSuccess();
        onClose();
      }
    } catch (error: any) {
      console.error(error);
      const errMsg = error.response?.data?.message || 'Ocurrió un error al reservar el tour.';
      Swal.fire({
        icon: 'error',
        title: 'Error al reservar tour',
        text: errMsg,
        confirmButtonColor: '#051911'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const clientesFiltrados = clientes.filter(c => 
    c.nombre.toLowerCase().includes(busquedaCliente.toLowerCase()) ||
    c.correo.toLowerCase().includes(busquedaCliente.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-100 flex flex-col">
        {/* Cabecera */}
        <div className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <MapPin size={20} className="text-emerald-400" />
            <h2 className="text-lg font-bold">Reservar Tour</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition">
            <X size={20} />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl">
            <h4 className="font-bold text-emerald-950 text-sm">{nombrePaquete}</h4>
            <p className="text-xs text-emerald-800 font-medium">Precio del paquete: S/. {precio.toFixed(2)}</p>
          </div>

          {/* Buscador de clientes */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
              <User size={12} /> Cliente / Huésped
            </label>
            <input 
              type="text" 
              placeholder="Buscar cliente por nombre o correo..." 
              value={busquedaCliente} 
              onChange={e => setBusquedaCliente(e.target.value)}
              className="w-full border border-slate-200 p-2.5 rounded-xl text-sm outline-none focus:border-slate-900 transition mb-2"
            />
            <select 
              value={idUsuario} 
              onChange={e => setIdUsuario(e.target.value)} 
              required
              className="w-full border border-slate-200 p-2.5 rounded-xl text-sm outline-none focus:border-slate-900 transition bg-white"
            >
              <option value="">-- Selecciona un Cliente --</option>
              {clientesFiltrados.map(c => (
                <option key={c.id_usuario} value={c.id_usuario}>
                  {c.nombre} ({c.correo})
                </option>
              ))}
            </select>
          </div>

          {/* Botones de acción */}
          <div className="flex gap-3 pt-4 border-t border-slate-100">
            <button 
              type="button" 
              onClick={onClose} 
              className="flex-1 py-3 border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={submitting || !idUsuario}
              className={`flex-1 py-3 rounded-xl font-bold text-white transition ${
                idUsuario && !submitting
                  ? 'bg-slate-900 hover:bg-slate-800' 
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              {submitting ? 'Reservando...' : 'Confirmar Reserva'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
