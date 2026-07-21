import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import cliente from '../api/apiClient';
import { useAuthGlobal } from '../features/auth/context/AuthContext';
import { Calendar, User, ArrowLeft, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';

interface Habitacion {
  id_habitacion: number;
  nombre: string;
  precio_noche: number;
  capacidad: number;
  descripcion: string;
  estado: string;
}

interface Imagen {
  id_imagen: number;
  url_imagen: string;
}

export default function EstadiaDetallePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthGlobal();

  const [habitacion, setHabitacion] = useState<Habitacion | null>(null);
  const [imagenes, setImagenes] = useState<Imagen[]>([]);
  const [imagenActiva, setImagenActiva] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const [fechaEntrada, setFechaEntrada] = useState('');
  const [fechaSalida, setFechaSalida] = useState('');
  const [noches, setNoches] = useState(0);
  const [total, setTotal] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  // Cargar datos de la habitación e imágenes
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        const resHab = await cliente.get(`/habitaciones/${id}`);
        setHabitacion(resHab.data);

        const resImg = await cliente.get(`/habitaciones/${id}/imagenes`);
        const imgs = resImg.data?.imagenes || [];
        setImagenes(imgs);

        // Definir imagen activa por defecto
        if (imgs.length > 0) {
          setImagenActiva(imgs[0].url_imagen);
        } else {
          setImagenActiva('/placeholder.jpg'); // Fallback
        }
      } catch (error) {
        console.error("Error al cargar la habitación:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo cargar la información de la habitación.',
          confirmButtonColor: '#051911'
        });
        navigate('/estadia');
      } finally {
        setLoading(false);
      }
    };

    if (id) cargarDatos();
  }, [id, navigate]);

  // Calcular noches y total
  useEffect(() => {
    if (fechaEntrada && fechaSalida && habitacion) {
      const entrada = new Date(fechaEntrada);
      const salida = new Date(fechaSalida);
      const diffTime = salida.getTime() - entrada.getTime();
      const calculatedNights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (calculatedNights > 0) {
        setNoches(calculatedNights);
        setTotal(calculatedNights * Number(habitacion.precio_noche));
      } else {
        setNoches(0);
        setTotal(0);
      }
    } else {
      setNoches(0);
      setTotal(0);
    }
  }, [fechaEntrada, fechaSalida, habitacion]);

  const handleReservar = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      // Guardar intención de reserva y redirigir
      sessionStorage.setItem('pending_booking', JSON.stringify({ id_habitacion: id, fechaEntrada, fechaSalida }));
      
      Swal.fire({
        title: 'Iniciar Sesión Requerido',
        text: 'Debes iniciar sesión como huésped para poder reservar esta habitación.',
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Iniciar Sesión',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#051911',
        cancelButtonColor: '#d33'
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/auth/login');
        }
      });
      return;
    }

    if (noches <= 0) {
      Swal.fire({
        icon: 'error',
        title: 'Fechas Inválidas',
        text: 'La fecha de salida debe ser posterior a la fecha de entrada.',
        confirmButtonColor: '#051911'
      });
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        id_usuario: user?.id,
        id_habitacion: Number(id),
        fecha_entrada: fechaEntrada,
        fecha_salida: fechaSalida
      };

      const res = await cliente.post('/reservas', payload);
      if (res.data && res.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Reserva registrada',
          text: 'Ahora selecciona un método de pago para continuar.',
          confirmButtonColor: '#051911'
        }).then(() => {
          navigate(`/pago/${res.data.id_reserva}`);
        });
      }
    } catch (error: any) {
      console.error(error);
      const errMsg = error.response?.data?.message || 'No se pudo crear la reserva en las fechas seleccionadas.';
      Swal.fire({
        icon: 'error',
        title: 'Error de Disponibilidad',
        text: errMsg,
        confirmButtonColor: '#051911'
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-36 flex items-center justify-center bg-white">
        <div className="text-slate-500 animate-pulse text-lg font-serif">Cargando detalles de la estadía...</div>
      </div>
    );
  }

  if (!habitacion) return null;

  return (
    <div className="min-h-screen pt-28 bg-[#FAF9F6] pb-20">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Botón de Retorno */}
        <button 
          onClick={() => navigate('/estadia')}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium mb-6 group transition-colors"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Volver a habitaciones
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Columna Izquierda: Galería e Información */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Visor de Imágenes */}
            <div className="space-y-4">
              <div className="h-[450px] overflow-hidden rounded-3xl shadow-md border border-slate-100 bg-white">
                <img 
                  src={imagenActiva} 
                  alt={habitacion.nombre} 
                  className="w-full h-full object-cover transition-all duration-500"
                />
              </div>
              
              {/* Miniaturas */}
              {imagenes.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin">
                  {imagenes.map((img) => (
                    <button
                      key={img.id_imagen}
                      onClick={() => setImagenActiva(img.url_imagen)}
                      className={`flex-shrink-0 w-24 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                        imagenActiva === img.url_imagen ? 'border-slate-900 scale-95 shadow-sm' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img.url_imagen} alt="Miniatura" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Detalles de la habitación */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-serif text-slate-800 tracking-tight">{habitacion.nombre}</h1>
                <div className="flex gap-4 mt-2">
                  <span className="text-sm font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full flex items-center gap-1">
                    <User size={14} /> Capacidad: {habitacion.capacidad} personas
                  </span>
                  <span className={`text-sm font-semibold px-3 py-1 rounded-full uppercase flex items-center gap-1 ${
                    habitacion.estado === 'disponible' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                  }`}>
                    <CheckCircle2 size={14} /> {habitacion.estado}
                  </span>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-6">
                <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <Sparkles size={16} className="text-yellow-500" /> Descripción
                </h3>
                <p className="text-slate-600 leading-relaxed text-sm md:text-base font-normal">
                  {habitacion.descripcion || 'Esta elegante habitación ofrece todas las comodidades para una estadía placentera y relajante en Posada Blanca.'}
                </p>
              </div>

              <div className="border-t border-slate-100 pt-6">
                <h3 className="text-lg font-bold text-slate-800 mb-3">Servicios Incluidos</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-slate-600 text-sm">
                  <div className="flex items-center gap-2">✓ Wifi de alta velocidad</div>
                  <div className="flex items-center gap-2">✓ Aire acondicionado</div>
                  <div className="flex items-center gap-2">✓ Agua caliente 24h</div>
                  <div className="flex items-center gap-2">✓ Toallas y sábanas limpias</div>
                  <div className="flex items-center gap-2">✓ Desayuno de cortesía</div>
                  <div className="flex items-center gap-2">✓ Smart TV</div>
                </div>
              </div>
            </div>

          </div>

          {/* Columna Derecha: Widget de Reserva */}
          <div>
            <div className="bg-white p-6 rounded-3xl shadow-lg border border-slate-100 sticky top-32 space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <span className="text-2xl font-bold text-slate-900">S/. {habitacion.precio_noche}</span>
                <span className="text-sm text-slate-500 font-medium"> / noche</span>
              </div>

              <form onSubmit={handleReservar} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                    <Calendar size={12} /> Fecha de Entrada
                  </label>
                  <input 
                    type="date"
                    value={fechaEntrada}
                    onChange={e => setFechaEntrada(e.target.value)}
                    required
                    className="w-full border border-slate-200 p-3 rounded-2xl text-sm outline-none focus:border-slate-900 transition"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                    <Calendar size={12} /> Fecha de Salida
                  </label>
                  <input 
                    type="date"
                    value={fechaSalida}
                    onChange={e => setFechaSalida(e.target.value)}
                    required
                    className="w-full border border-slate-200 p-3 rounded-2xl text-sm outline-none focus:border-slate-900 transition"
                  />
                </div>

                {/* Resumen de Costos */}
                {noches > 0 && (
                  <div className="bg-[#FAF9F6] p-4 rounded-2xl border border-slate-100 text-sm space-y-2">
                    <div className="flex justify-between text-slate-600">
                      <span>S/. {habitacion.precio_noche} x {noches} noches</span>
                      <span>S/. {total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-slate-800 text-base pt-2 border-t border-slate-200">
                      <span>Total estimado</span>
                      <span>S/. {total.toFixed(2)}</span>
                    </div>
                  </div>
                )}

                {/* Botón */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#051911] hover:bg-black text-white py-4 rounded-2xl font-bold text-sm transition shadow-md flex justify-center items-center"
                >
                  {submitting ? 'Procesando...' : isAuthenticated ? 'Reservar Ahora' : 'Inicia Sesión para Reservar'}
                </button>
              </form>

              {/* Advertencia de política */}
              <div className="flex gap-2 text-xs text-slate-500 bg-amber-50/50 p-3 rounded-xl border border-amber-100/50">
                <ShieldAlert size={14} className="text-amber-500 flex-shrink-0 mt-0.5" />
                <p>Políticas: Cancelación gratuita hasta 24 horas antes del check-in. No se permiten mascotas.</p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
