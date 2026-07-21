import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'; 
import { Menu, X, LogOut, User, ChevronDown } from 'lucide-react';
import { useAuthGlobal } from '../features/auth/context/AuthContext';
import { obtenerNombreCorto } from '../utils/formatName';
import Swal from 'sweetalert2';
export const Navbar = () => { 
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const { user, isAuthenticated, logoutGlobal } = useAuthGlobal();
  
  const location = useLocation();
  const navigate = useNavigate();
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cierra el dropdown de perfil si se hace clic afuera de él
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

const handleLogout = async () => {
  const result = await Swal.fire({
    icon: 'warning',
    title: '¿Cerrar sesión?',
    text: '¿Estás seguro de que deseas salir?',
    showCancelButton: true,
    confirmButtonText: 'Sí, cerrar sesión',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#ef4444', 
    cancelButtonColor: '#94a3b8',
    background: '#ffffff',
    color: '#1f2937',
  });

  if (result.isConfirmed) {
    logoutGlobal();
    setIsOpen(false);
    setIsProfileOpen(false);
    navigate('/');
  }
};
  const navLinks = [
  { name: 'Inicio', path: '/' },
  { name: 'Estadía', path: '/estadia' },
  { name: 'Experiencias', path: '/experiencias' },
  { name: 'Blog', path: '/blog' },
];

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
      scrolled 
        ? 'py-3 bg-white/90 backdrop-blur-lg shadow-premium' 
        : 'py-6 bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
        <Link to="/" className={`text-2xl font-serif font-bold transition-colors duration-300 ${
          scrolled || location.pathname !== '/' ? 'text-primary' : 'text-white drop-shadow-md'
        }`}>
          La Posada Blanca
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
         {navLinks.map((link) => {
  const isActive = link.path === '/' 
    ? location.pathname === '/' 
    : location.pathname.startsWith(link.path);

  const isScrolledOrNotHome = scrolled || location.pathname !== '/';
  
  const textColor = isScrolledOrNotHome 
    ? (isActive ? 'text-primary' : 'text-slate-600 hover:text-primary') 
    : (isActive ? 'text-white' : 'text-white/80 hover:text-white');

  const borderColor = isActive 
    ? (isScrolledOrNotHome ? 'border-primary' : 'border-white') 
    : 'border-transparent';

  return (
    <Link
      key={link.name}
      to={link.path}
      className={`font-sans text-sm font-medium transition-colors duration-200 border-b-2 pb-1.5 ${textColor} ${borderColor}`}
    >
      {link.name}
    </Link>
  );
})}
        </div>

        {/* Controles de Acceso (Desktop) */}
        <div className="hidden md:flex items-center gap-6">
          {isAuthenticated && user ? (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 bg-primary/5 px-4 py-2 rounded-2xl border border-outline-variant/20 hover:bg-primary/10 transition-colors"
              >
                <div className={`flex items-center gap-1.5 text-sm font-semibold ${scrolled || location.pathname !== '/' ? 'text-primary' : 'text-white'}`}>
                  <User size={18} className="p-0.5 bg-primary/20 rounded-full text-primary" />
                  <span>Hola, <span className="font-bold text-[#f38721]">{obtenerNombreCorto(user.nombre)}</span></span>
                </div>
                <ChevronDown 
                  size={16} 
                  className={`transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''} ${scrolled || location.pathname !== '/' ? 'text-primary' : 'text-white'}`} 
                />
              </button>

              {/* Dropdown de Perfil */}
              {isProfileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-premium-xl border border-outline-variant/20 py-2 overflow-hidden"
                >
                  <Link
                    to="/perfil"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-on-surface hover:bg-primary/5 transition-colors"
                  >
                    <User size={16} className="text-primary" />
                    Ver mi perfil
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors text-left"
                  >
                    <LogOut size={16} />
                    Cerrar sesión
                  </button>
                </motion.div>
              )}
            </div>
          ) : (
            <Link 
              to="/auth/login" 
              className={`text-sm font-semibold transition-colors duration-300 ${
                scrolled || location.pathname !== '/' ? 'text-primary' : 'text-white hover:text-white/80'
              }`}
            >
              Iniciar sesión
            </Link>
          )}

          <Link to="/estadia">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`${
                scrolled || location.pathname !== '/'
                  ? 'bg-primary text-white' 
                  : 'bg-white text-primary'
              } px-6 py-2.5 rounded-xl font-semibold text-sm shadow-premium hover:shadow-premium-xl transition-all`}
            >
              Reserva ahora
            </motion.button>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button 
          className={`md:hidden ${scrolled || location.pathname !== '/' ? 'text-primary' : 'text-white'}`} 
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-white border-t border-outline-variant p-6 flex flex-col gap-4 shadow-xl"
        >
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className="text-lg font-medium text-on-surface"
            >
              {link.name}
            </Link>
          ))}

          {isAuthenticated && user ? (
            <div className="flex flex-col gap-2 pt-2 border-t border-outline-variant/30">
              <div className="text-sm font-semibold text-on-surface-variant flex items-center gap-2 py-2">
                <User size={18} className="text-primary" /> Hola, <span className="font-bold text-[#f38721]">{obtenerNombreCorto(user.nombre)}</span>
              </div>
              <Link
                to="/perfil"
                onClick={() => setIsOpen(false)}
                className="text-lg font-medium text-on-surface flex items-center gap-2 py-2"
              >
                <User size={18} className="text-primary" /> Ver mi perfil
              </Link>
              <button 
                onClick={handleLogout}
                className="text-lg font-semibold text-red-500 flex items-center gap-2 py-2 text-left"
              >
                <LogOut size={18} /> Cerrar sesión
              </button>
            </div>
          ) : (
            <Link to="/auth/login" onClick={() => setIsOpen(false)} className="text-lg font-semibold text-primary py-2 border-t border-outline-variant/30">
              Iniciar sesión
            </Link>
          )}

          <Link to="/estadia" onClick={() => setIsOpen(false)}>
            <button className="w-full bg-primary text-white py-3 rounded-xl font-bold mt-2">
              Reserva ahora
            </button>
          </Link>
        </motion.div>
      )}
    </nav>
  );
};