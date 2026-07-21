import { Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { useResetPassword, getPasswordStrength } from '../hooks/useResetPassword';

interface ResetPasswordFormProps {
  token: string;
}

export const ResetPasswordForm = ({ token }: ResetPasswordFormProps) => {
  const {
    password, setPassword,
    confirmPassword, setConfirmPassword,
    showPassword, setShowPassword,
    showConfirmPassword, setShowConfirmPassword,
    loading, handleSubmit,
  } = useResetPassword(token);

  const strength = getPasswordStrength(password);

  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;
  const passwordsMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* 🔒 Nueva Contraseña */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">
          Nueva Contraseña
        </label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" size={20} />
          <input
            type={showPassword ? 'text' : 'password'}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mínimo 8 caracteres"
            className="w-full bg-surface-container pl-12 pr-12 py-3.5 rounded-2xl border border-outline-variant/30 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-medium text-primary text-sm"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Barra de fuerza — igual que en Register */}
        {password && (
          <div className="flex items-center justify-between pt-1 ml-1">
            <div className="flex gap-1.5">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`h-1.5 w-8 rounded-full transition-all ${
                    strength.score >= i ? strength.color.split(' ')[0] : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
            <span className={`text-[11px] font-bold ${strength.color.split(' ')[1]}`}>
              {strength.label}
            </span>
          </div>
        )}
      </div>

      {/* 🔄 Confirmar Contraseña */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">
          Confirmar Contraseña
        </label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" size={20} />
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repite tu contraseña"
            className={`w-full bg-surface-container pl-12 pr-12 py-3.5 rounded-2xl border transition-all font-medium text-primary text-sm focus:outline-none focus:ring-1 ${
              passwordsMismatch
                ? 'border-red-400 focus:border-red-400 focus:ring-red-400'
                : passwordsMatch
                ? 'border-green-400 focus:border-green-400 focus:ring-green-400'
                : 'border-outline-variant/30 focus:border-primary focus:ring-primary'
            }`}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors"
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Mensaje de coincidencia */}
        {passwordsMismatch && (
          <p className="text-xs text-red-500 ml-1 font-medium">Las contraseñas no coinciden</p>
        )}
        {passwordsMatch && (
          <p className="text-xs text-green-500 ml-1 font-medium flex items-center gap-1">
            <CheckCircle2 size={12} /> Las contraseñas coinciden
          </p>
        )}
      </div>

      {/* Botón */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-sm shadow-premium hover:shadow-premium-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3 mt-6 disabled:opacity-50"
      >
        <CheckCircle2 size={18} />
        {loading ? 'Actualizando...' : 'Actualizar contraseña'}
      </button>

      <p className="text-center text-sm font-medium text-on-surface-variant mt-8">
        ¿Ya la recordaste?{' '}
        <Link to="/auth/login" className="text-primary font-bold hover:underline">
          Iniciar Sesión
        </Link>
      </p>
    </form>
  );
};