import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowLeft } from 'lucide-react';
import { useVerifyEmail } from '../hooks/useVerifyEmail';

export const VerifyEmailForm = () => {
  const {
    codigo, correo, loading, timer, canResend, inputsRef,
    handleOtpChange, handleOtpKeyDown, handleSubmit, handleReenviarCodigo
  } = useVerifyEmail();

  return (
    <div className="space-y-6">

      {/* Correo destino */}
      <div className="text-center space-y-1">
        <p className="text-sm text-on-surface-variant font-medium">
          Hemos enviado un código de verificación a:
        </p>
        <p className="text-primary font-bold text-base">{correo}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* OTP inputs */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">
            Código de Verificación
          </label>
          <div className="flex gap-2 justify-between">
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <input
                key={index}
                ref={(el) => { inputsRef.current[index] = el; }}
                type="text"
                maxLength={1}
                value={codigo[index]}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                className="w-12 h-12 text-center text-xl font-bold bg-surface-container rounded-xl border border-outline-variant/30 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-primary"
              />
            ))}
          </div>
        </div>

        {/* Botón confirmar */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-sm shadow-premium hover:shadow-premium-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Validando cuenta...</span>
            </>
          ) : (
            <>
              <ShieldCheck size={18} />
              <span>Confirmar</span>
            </>
          )}
        </button>
      </form>

      {/* Timer / reenvío */}
      <p className="text-center text-sm font-medium text-on-surface-variant">
        {canResend ? (
          <>
            ¿No recibiste el correo?{' '}
            <button
              type="button"
              onClick={handleReenviarCodigo}
              disabled={loading}
              className="text-primary font-bold hover:underline bg-transparent border-none cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Enviando...' : 'Reenviar código'}
            </button>
          </>
        ) : (
          <>
            Puedes solicitar un nuevo código en{' '}
            <span className="text-primary font-bold">{timer}s</span>
          </>
        )}
      </p>

      {/* Volver */}
      <p className="text-center text-sm font-medium text-on-surface-variant mt-6">
        <Link to="/auth/login" className="inline-flex items-center gap-2 text-primary font-bold hover:underline">
          <ArrowLeft size={16} /> Regresar al Login
        </Link>
      </p>
    </div>
  );
};