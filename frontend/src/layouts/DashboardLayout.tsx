  import { useEffect, useState } from 'react';
  import { Outlet, useNavigate, NavLink } from 'react-router-dom';
  import { useAuthGlobal } from '../features/auth/context/AuthContext';
  import { LogOut, User, LayoutDashboard, Bed, Shield, ListChecks, Map, BarChart3, CreditCard, KeyRound, History, Wallet } from 'lucide-react';
  import cliente from '../api/apiClient';
  import Swal from 'sweetalert2';

  export const DashboardLayout = () => {
    const { user, logoutGlobal } = useAuthGlobal();
    const [pagosPendientes, setPagosPendientes] = useState(0);
    const [contadorInicial, setContadorInicial] = useState<number | null>(null);
    const navigate = useNavigate();

    const handleLogout = () => {
      logoutGlobal();
      navigate('/auth/login');
    };

    const cargarPagosPendientes = async () => {
      try {
        const res = await cliente.get('/pagos/pendientes');
        const cantidad = res.data.pagos?.length || 0;

        setPagosPendientes(cantidad);

        if (contadorInicial !== null && cantidad > contadorInicial) {
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'info',
            title: 'Nuevo comprobante recibido',
            text: 'Hay un nuevo pago pendiente de revisión.',
            showConfirmButton: false,
            timer: 4000,
          });
        }

        setContadorInicial(cantidad);
      } catch (error) {
        console.error(error);
      }
    };

    useEffect(() => {
        if (user?.rol !== 2 && user?.rol !== 3) return;

        cargarPagosPendientes();

        const intervalo = setInterval(() => {
          cargarPagosPendientes();
        }, 15000);

        return () => clearInterval(intervalo);
      }, [user]);

    const navClass = ({ isActive }: { isActive: boolean }) => 
      `w-full flex items-center gap-2 text-left px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
        isActive ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'
      }`;

    return (
      <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
        <aside className="w-full md:w-64 bg-white border-r border-slate-200 p-5 flex flex-col justify-between">
          <div>
            <div
                onClick={() => navigate('/')}
                className="flex items-center gap-2 px-2 py-3 mb-6 border-b border-slate-100 cursor-pointer" >
                <Shield className="text-blue-600" size={24} />
                <span className="font-bold text-slate-800 text-lg">Posada Blanca</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl mb-6 flex items-center gap-3">
              <div className="bg-blue-600/10 p-2 rounded-lg text-blue-600">
                <User size={20} />
              </div>
              <div className="overflow-hidden">
                <h4 className="font-bold text-slate-800 text-sm truncate">{user?.nombre || 'Usuario'}</h4>
                <span className="text-xs text-slate-500 font-medium">
                  {user?.rol === 3 ? 'Administrador' : user?.rol === 2 ? 'Recepción' : 'Cliente'}
                </span>
              </div>
            </div>

            <nav className="space-y-1">
              {/* MENÚ ADMINISTRADOR */}
              {user?.rol === 3 && (
                <>
                    <div className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Admin Panel</div>
                    <NavLink to="/admin/dashboard" className={navClass}>
                      <BarChart3 size={18} />
                      Dashboard General
                    </NavLink>
                    <NavLink to="/admin/roles-permisos" className={navClass}>
                      <KeyRound size={18} />
                      Roles y Permisos
                    </NavLink>
                    <NavLink to="/admin/personal" className={navClass}>
                      <User size={18} />
                      Gestión de Personal
                    </NavLink>
                    <NavLink to="/admin/historial" className={navClass}>
                      <History size={18} />
                      Historial de Actividad
                    </NavLink>
                    <NavLink to="/admin/habitaciones-gestion" className={navClass}>
                      <Bed size={18} />
                      Gestión de Habitaciones
                    </NavLink>
                    <NavLink to="/admin/paquetes" className={navClass}>
                    <Map size={18} />
                    Gestión de Tours
                    </NavLink>
                    <NavLink to="/admin/cuentas-pago" className={navClass}>
                      <Wallet size={18} />
                      Cuentas de Pago
                    </NavLink>
                </>)}

              {(user?.rol === 2 || user?.rol === 3) && ( <>
                  {/* MENÚ COMPARTIDO */}
                  <div className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider mt-4">Gestión Operativa</div>

                  {/* --- Nuevo enlace añadido aquí --- */}
                  <NavLink to="/recep/clientes" className={navClass}>
                    <User size={18} />
                    Gestión de Clientes
                  </NavLink>

                  <NavLink to="/recep" end className={navClass}>
                    <LayoutDashboard size={18} />
                    Monitoreo
                  </NavLink>

                  <NavLink to="/recep/reservas" className={navClass}>
                    <ListChecks size={18} />
                    Reservas
                  </NavLink>

                  <NavLink to="/recep/pagos" className={navClass}>
                    <CreditCard size={18} />
                    <span className="flex-1">Pagos pendientes</span>
                      {pagosPendientes > 0 && (
                        <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                          {pagosPendientes}
                        </span>
                      )}
                  </NavLink>

                  <NavLink to="/recep/habitaciones" className={navClass}>
                    <Bed size={18} />
                    Habitaciones
                  </NavLink>

                  <NavLink to="/recep/tours" className={navClass}>
                    <Map size={18} />
                    Tours
                  </NavLink>
                </>)}
            </nav>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-600 py-3 rounded-xl font-bold text-sm transition-colors mt-6"
          >
            <LogOut size={16} />
            Cerrar Sesión
          </button>
        </aside>

        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    );
  };