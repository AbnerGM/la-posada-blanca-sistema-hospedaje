import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import cliente from '../../../api/apiClient';
import { X, Calendar, User, Bed, Landmark } from 'lucide-react';
import { NuevoClienteModal } from './NuevoClienteModal';

interface Cliente {
  id_usuario: number;
  nombre: string;
  correo: string;
  telefono: string;
}

interface Room {
  id_habitacion: number;
  nombre: string;
  precio_noche: number;
  capacidad: number;
}

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

export const NuevaReservaModal = ({ onClose, onSuccess }: Props) => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [habitaciones, setHabitaciones] = useState<Room[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [busquedaCliente, setBusquedaCliente] = useState('');
  const [mostrarNuevoCliente, setMostrarNuevoCliente] = useState(false);
  
  const [form, setForm] = useState({
    id_usuario: '',
    fecha_entrada: '',
    fecha_salida: '',
    id_habitacion: ''
  });

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

  // Consultar habitaciones cuando cambien las fechas
  useEffect(() => {
    if (form.fecha_entrada && form.fecha_salida) {
      if (new Date(form.fecha_entrada) >= new Date(form.fecha_salida)) {
        setHabitaciones([]);
        return;
      }

      const cargarHabitacionesDisponibles = async () => {
        try {
          setLoadingRooms(true);
          const res = await cliente.get('/habitaciones', {
            params: {
              fechaEntrada: form.fecha_entrada,
              fechaSalida: form.fecha_salida
            }
          });
          setHabitaciones(res.data || []);
        } catch (error) {
          console.error("Error al cargar disponibilidad:", error);
          setHabitaciones([]);
        } finally {
          setLoadingRooms(false);
        }
      };
      cargarHabitacionesDisponibles();
    } else {
      setHabitaciones([]);
    }
  }, [form.fecha_entrada, form.fecha_salida]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setForm(prev => {
      const nuevoForm = { ...prev, [name]: value };
      
      // Si se cambian las fechas, reseteamos la habitación seleccionada
      if (name === 'fecha_entrada' || name === 'fecha_salida') {
        nuevoForm.id_habitacion = '';
      }
      
      return nuevoForm;
    });
  };

  const clienteCreado = (nuevoCliente: Cliente) => {
    setClientes(prev => [...prev, nuevoCliente]);
    setForm(prev => ({ ...prev, id_usuario: String(nuevoCliente.id_usuario) }));
    setMostrarNuevoCliente(false);
  };

  // --- CÁLCULO DE NOCHES Y TOTAL ---
  const calcularNoches = (): number => {
    if (!form.fecha_entrada || !form.fecha_salida) return 0;
    
    const entrada = new Date(form.fecha_entrada + 'T00:00:00');
    const salida = new Date(form.fecha_salida + 'T00:00:00');
    
    const diferenciaMs = salida.getTime() - entrada.getTime();
    if (diferenciaMs <= 0) return 0;
    
    return Math.ceil(diferenciaMs / (1000 * 60 * 60 * 24));
  };

  const noches = calcularNoches();
  const habitacionSeleccionada = habitaciones.find(h => String(h.id_habitacion) === form.id_habitacion);
  const totalReserva = habitacionSeleccionada ? noches * habitacionSeleccionada.precio_noche : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.id_usuario || !form.id_habitacion || !form.fecha_entrada || !form.fecha_salida) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor complete todos los datos requeridos.',
        confirmButtonColor: '#051911'
      });
      return;
    }

    try {
      const payload = {
        id_usuario: Number(form.id_usuario),
        id_habitacion: Number(form.id_habitacion),
        fecha_entrada: form.fecha_entrada,
        fecha_salida: form.fecha_salida,
        origen: 'recepcion'
      };

      const res = await cliente.post('/reservas', payload);
      if (res.data && res.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Reserva Creada',
          text: `La reserva ha sido registrada correctamente por un total de S/. ${totalReserva.toFixed(2)}.`,
          confirmButtonColor: '#051911'
        });
        onSuccess();
        onClose();
      }
    } catch (error: any) {
      console.error(error);
      const errMsg = error.response?.data?.message || 'Ocurrió un error al crear la reserva.';
      Swal.fire({
        icon: 'error',
        title: 'Error al reservar',
        text: errMsg,
        confirmButtonColor: '#051911'
      });
    }
  };

  // Filtrar lista de clientes según búsqueda
  const clientesFiltrados = clientes.filter(c => 
    c.nombre.toLowerCase().includes(busquedaCliente.toLowerCase()) ||
    c.correo.toLowerCase().includes(busquedaCliente.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[90vh]">
        
        {/* Cabecera */}
        <div className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Landmark size={20} className="text-blue-400" />
            <h2 className="text-lg font-bold">Crear Nueva Reserva</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition">
            <X size={20} />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          
          {/* Búsqueda y Selección de Cliente */}
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
            <div className="flex justify-end mb-2">
              <button 
                type="button" 
                onClick={() => setMostrarNuevoCliente(true)} 
                className="text-sm font-semibold text-blue-600 hover:text-blue-800"
              >
                + Registrar nuevo cliente
              </button>
            </div>
            <select 
              name="id_usuario" 
              value={form.id_usuario} 
              onChange={handleInputChange} 
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

          {/* Fechas de Estadía */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
                <Calendar size={12} /> Entrada
              </label>
              <input 
                type="date" 
                name="fecha_entrada" 
                value={form.fecha_entrada} 
                onChange={handleInputChange} 
                required
                className="w-full border border-slate-200 p-2.5 rounded-xl text-sm outline-none focus:border-slate-900 transition"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
                <Calendar size={12} /> Salida
              </label>
              <input 
                type="date" 
                name="fecha_salida" 
                value={form.fecha_salida} 
                onChange={handleInputChange} 
                required
                className="w-full border border-slate-200 p-2.5 rounded-xl text-sm outline-none focus:border-slate-900 transition"
              />
            </div>
          </div>

          {/* Selección de Habitación */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
              <Bed size={12} /> Habitación Disponible
            </label>
            {loadingRooms ? (
              <div className="text-xs text-slate-500 animate-pulse py-2">Consultando disponibilidad...</div>
            ) : form.fecha_entrada && form.fecha_salida ? (
              habitaciones.length > 0 ? (
                <select 
                  name="id_habitacion" 
                  value={form.id_habitacion} 
                  onChange={handleInputChange} 
                  required
                  className="w-full border border-slate-200 p-2.5 rounded-xl text-sm outline-none focus:border-slate-900 transition bg-white"
                >
                  <option value="">-- Selecciona una Habitación --</option>
                  {habitaciones.map(h => (
                    <option key={h.id_habitacion} value={h.id_habitacion}>
                      {h.nombre} - S/. {h.precio_noche}/noche (Cap: {h.capacidad})
                    </option>
                  ))}
                </select>
              ) : (
                <div className="text-xs text-rose-500 font-semibold py-2">
                  No hay habitaciones disponibles para el rango de fechas seleccionado.
                </div>
              )
            ) : (
              <div className="text-xs text-slate-400 py-2">
                Selecciona fechas de entrada y salida para ver habitaciones disponibles.
              </div>
            )}
          </div>

          {/* CUADRO DE CÁLCULO DE TOTAL */}
          {habitacionSeleccionada && noches > 0 && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex justify-between items-center mt-2 animate-fadeIn">
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Resumen del Costo</span>
                <p className="text-xs text-slate-600">
                  {noches} {noches === 1 ? 'noche' : 'noches'} × S/. {habitacionSeleccionada.precio_noche.toFixed(2)}
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-slate-400 block">Total</span>
                <span className="text-xl font-black text-slate-900 flex items-center justify-end gap-0.5">
                  S/. {totalReserva.toFixed(2)}
                </span>
              </div>
            </div>
          )}

          {/* Botones de Acción */}
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
              disabled={!form.id_habitacion}
              className={`flex-1 py-3 rounded-xl font-bold text-white transition ${
                form.id_habitacion 
                  ? 'bg-slate-900 hover:bg-slate-800' 
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              Crear Reserva
            </button>
          </div>
        </form>
      </div>

      {/* Modal Secundario para Nuevo Cliente */}
      {mostrarNuevoCliente && (
        <NuevoClienteModal
          onClose={() => setMostrarNuevoCliente(false)}
          onClienteCreado={clienteCreado}
        />
      )}
    </div>
  );
};