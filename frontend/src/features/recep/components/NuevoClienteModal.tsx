import { useState } from 'react';
import { X } from 'lucide-react';
import cliente from '../../../api/apiClient';
import Swal from 'sweetalert2';

interface Props {
  onClose: () => void;
  onClienteCreado: (cliente: { id_usuario: number; nombre: string; correo: string; telefono: string }) => void;
}

export const NuevoClienteModal = ({ onClose, onClienteCreado }: Props) => {
    const [form, setForm] = useState({ dni: '', nombre: '', telefono: '', correo: '' });
    const [buscandoDni, setBuscandoDni] = useState(false);
    const guardarCliente = async () => {
        try {
            const res = await cliente.post('/auth/clientes/recepcion', form);
            onClienteCreado({ id_usuario: res.data.id_usuario, nombre: res.data.nombre, correo: res.data.correo, telefono: form.telefono });
            onClose();
        } catch (error: any) {
            Swal.fire('Error', error.response?.data?.message || 'No se pudo registrar el cliente.', 'error');
    }};
    const buscarDni = async (dni: string) => {
        if (dni.length !== 8) return;
        try {
            setBuscandoDni(true);
            const res = await cliente.get(`/auth/dni/${dni}`);
            if (res.data.success) setForm(prev => ({ ...prev, nombre: res.data.nombre }));
        } catch {
            Swal.fire('DNI no encontrado', 'Verifica el número ingresado.', 'warning');
            setForm(prev => ({ ...prev, nombre: '' }));
        } finally {
            setBuscandoDni(false);
    }};    

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[60]">
      <div className="bg-white rounded-2xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold">Nuevo Cliente</h2>
          <button onClick={onClose}><X size={20} /></button>
        </div>

        <div className="space-y-3">
          <input type="text" placeholder="DNI" maxLength={8} value={form.dni} onChange={(e) => { const dni = e.target.value.replace(/\D/g, ''); setForm({ ...form, dni }); buscarDni(dni); }} className="w-full border p-2 rounded-xl" />

          <input type="text" placeholder={buscandoDni ? 'Consultando DNI...' : 'Nombre completo'} value={form.nombre} readOnly className="w-full border p-2 rounded-xl bg-slate-100 text-slate-600" />
        
          <input type="text" placeholder="Teléfono" value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} className="w-full border p-2 rounded-xl" />

          <input type="email" placeholder="Correo" value={form.correo} onChange={(e) => setForm({ ...form, correo: e.target.value })} className="w-full border p-2 rounded-xl" />
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-4 py-2 border rounded-xl">
            Cancelar
          </button>
          <button onClick={guardarCliente} className="px-4 py-2 bg-slate-900 text-white rounded-xl">
            Guardar
          </button>
        </div>
      </div>
    </div>
  );

};