import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, User, Phone, Eye, EyeOff, Search } from 'lucide-react';
import { useRegister } from '../hooks/useRegister';
import { useState } from 'react';

export const RegisterForm = () => {
  const {
    dni, setDni, nombre, telefono, setTelefono, email, setEmail,
    password, setPassword, confirmPassword, setConfirmPassword,
    showPassword, setShowPassword,
    loading, verifyingDni, handleVerificarDni, handleSubmit
  } = useRegister();

  const getPasswordStrength = (pass: string) => {
    if (pass.length === 0) return { score: 0, label: '', color: '' };
    if (pass.length < 6)   return { score: 1, label: 'Débil',  color: 'bg-red-500 text-red-500' };
    if (pass.length < 10)  return { score: 2, label: 'Media',  color: 'bg-yellow-500 text-yellow-500' };
    return { score: 3, label: 'Fuerte', color: 'bg-green-500 text-green-500' };
  };
  const strength = getPasswordStrength(password);

  const passwordsMatch    = confirmPassword.length > 0 && password === confirmPassword;
  const passwordsMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* 🪪 DNI */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">
            Documento de Identidad (DNI)
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" size={20} />
              <input
                type="text"
                maxLength={8}
                placeholder="Ingresa tus 8 dígitos"
                value={dni}
                onChange={(e) => setDni(e.target.value.replace(/\D/g, ''))}
                required
                className="w-full bg-surface-container pl-12 pr-4 py-3.5 rounded-2xl border border-outline-variant/30 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-medium text-sm text-primary"
              />
            </div>
            <button
              type="button"
              onClick={handleVerificarDni}
              disabled={verifyingDni}
              className={`bg-primary text-white px-5 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all text-sm ${verifyingDni ? 'opacity-70 cursor-wait' : 'hover:bg-primary/90'}`}
            >
              {verifyingDni ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Cargando...</span>
                </>
              ) : (
                <>
                  <Search size={16} />
                  <span>Verificar</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 👤 NOMBRE */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">
            Nombre Completo
          </label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" size={20} />
            <input
              type="text"
              value={nombre}
              readOnly
              placeholder="Se autocompletará al verificar tu DNI"
              className="w-full bg-gray-100 dark:bg-zinc-800 cursor-not-allowed pl-12 pr-4 py-3.5 rounded-2xl border border-outline-variant/30 font-medium text-sm text-primary opacity-80"
            />
          </div>
        </div>

        {/* 📱 TELÉFONO */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">
            Teléfono / Celular
          </label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" size={20} />
            <input
              type="tel"
              placeholder="Ej: 987654321"
              value={telefono}
             onChange={(e) => {
  let val = e.target.value.replace(/\D/g, '');
  if (val.length > 0 && val[0] !== '9') val = val.slice(1);
  setTelefono(val.slice(0, 9));
}}
              required
              className="w-full bg-surface-container pl-12 pr-4 py-3.5 rounded-2xl border border-outline-variant/30 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-medium text-sm text-primary"
            />
          </div>
        </div>

        {/* ✉️ CORREO */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">
            Correo Electrónico
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" size={20} />
            <input
              type="email"
              placeholder="Ej: jose@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-surface-container pl-12 pr-4 py-3.5 rounded-2xl border border-outline-variant/30 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-medium text-sm text-primary"
            />
          </div>
        </div>

        {/* 🔒 CONTRASEÑA */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">
            Contraseña
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" size={20} />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Crea una contraseña segura"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-surface-container pl-12 pr-12 py-3.5 rounded-2xl border border-outline-variant/30 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-medium text-sm text-primary"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {password && (
            <div className="flex items-center justify-between pt-1 ml-1">
              <div className="flex gap-1.5">
                {[1, 2, 3].map((i) => (
                  <div key={i} className={`h-1.5 w-8 rounded-full transition-all ${strength.score >= i ? strength.color.split(' ')[0] : 'bg-gray-200'}`} />
                ))}
              </div>
              <span className={`text-[11px] font-bold ${strength.color.split(' ')[1]}`}>
                {strength.label}
              </span>
            </div>
          )}
        </div>

        {/* 🔒 CONFIRMAR CONTRASEÑA */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">
            Confirmar Contraseña
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" size={20} />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Repite tu contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className={`w-full bg-surface-container pl-12 pr-12 py-3.5 rounded-2xl border transition-all font-medium text-sm text-primary focus:outline-none focus:ring-1 ${
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
          {passwordsMismatch && (
            <p className="text-xs text-red-500 ml-1 font-medium">Las contraseñas no coinciden</p>
          )}
          {passwordsMatch && (
            <p className="text-xs text-green-500 ml-1 font-medium flex items-center gap-1">
              <span>✓</span> Las contraseñas coinciden
            </p>
          )}
        </div>

        {/* BOTÓN SUBMIT */}
        <button
          type="submit"
          disabled={loading || !nombre}
          className={`w-full bg-primary text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-premium transition-all text-sm mt-5 ${
            loading || !nombre ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-premium-xl hover:-translate-y-0.5'
          }`}
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Procesando...</span>
            </>
          ) : (
            <>
              <LogIn size={18} />
              <span>Registrarse</span>
            </>
          )}
        </button>
      </form>

      <p className="text-center text-sm font-medium text-on-surface-variant mt-8">
        ¿Ya tienes una cuenta?{' '}
        <Link to="/auth/login" className="text-primary font-bold hover:underline">
          Iniciar Sesión
        </Link>
      </p>
    </motion.div>
  );
};