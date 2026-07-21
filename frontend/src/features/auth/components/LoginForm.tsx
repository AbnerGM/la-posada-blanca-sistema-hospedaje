import { Link } from 'react-router-dom';
import { Mail, Lock, LogIn, Eye, EyeOff } from 'lucide-react'; // ◄ Tus iconos listos
import { useLogin } from '../hooks/useLogin';

export const LoginForm = () => {
  const { 
    email, setEmail, 
    password, setPassword, 
    showPassword, setShowPassword, 
    loading, handleSubmit 
  } = useLogin();

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      
      {/* Input de Correo Electrónico */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">
          Correo Electrónico
        </label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" size={20} />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Escribe tu correo"
            className="w-full bg-surface-container pl-12 pr-4 py-3.5 rounded-2xl border border-outline-variant/30 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-medium text-primary text-sm"
          />
        </div>
      </div>

      {/* Input de Contraseña */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center ml-1">
          <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
            Contraseña
          </label>
          <Link 
            to="/auth/forgot-password" 
            className="text-xs font-bold text-primary hover:underline underline-offset-2"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" size={20} />
          <input
            type={showPassword ? 'text' : 'password'}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Escribe tu contraseña"
            className="w-full bg-surface-container pl-12 pr-12 py-3.5 rounded-2xl border border-outline-variant/30 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-medium text-primary text-sm"
          />
          {/* Botón interactivo del ojito */}
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      {/* Botón de Enviar */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-sm shadow-premium hover:shadow-premium-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3 mt-6 disabled:opacity-50"
      >
        <LogIn size={18} />
        {loading ? 'Iniciando sesión...' : 'Ingresar'}
      </button>

      {/* Enlace a Registro */}
      <p className="text-center text-sm font-medium text-on-surface-variant mt-10">
        ¿No tienes una cuenta?{' '}
        <Link to="/auth/register" className="text-primary font-bold hover:underline">
          Registrarse
        </Link>
      </p>
    </form>
  );
};