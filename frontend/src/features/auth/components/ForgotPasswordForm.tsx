import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, KeyRound } from 'lucide-react';
import { useForgotPassword } from '../hooks/useForgotPassword';
import { EmailSentConfirmation } from './EmailSentConfirmation';

export const ForgotPasswordForm = () => {
  const { email, setEmail, loading, enviado, handleRequestSubmit } = useForgotPassword();

  if (enviado) return <EmailSentConfirmation email={email} />;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      

      <form onSubmit={handleRequestSubmit} className="space-y-5">
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
              placeholder="Ej: jose@gmail.com"
              disabled={loading}
              className="w-full bg-surface-container pl-12 pr-4 py-3.5 rounded-2xl border border-outline-variant/30 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-medium text-primary text-sm disabled:opacity-60"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-sm shadow-premium hover:shadow-premium-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3 mt-6 disabled:opacity-50"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Enviando...</span>
            </>
          ) : (
            <>
              <KeyRound size={18} />
              <span>Confirmar</span>
            </>
          )}
        </button>
      </form>

      <p className="text-center text-sm font-medium text-on-surface-variant mt-10">
        <Link to="/auth/login" className="inline-flex items-center gap-2 text-primary font-bold hover:underline">
          <ArrowLeft size={16} /> Volver a Iniciar Sesión
        </Link>
      </p>
    </motion.div>
  );
};