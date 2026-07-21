import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MailCheck } from 'lucide-react';

interface EmailSentConfirmationProps {
  email: string;
}

export const EmailSentConfirmation = ({ email }: EmailSentConfirmationProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center text-center gap-5 py-4"
    >
      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
        <MailCheck className="text-primary" size={40} />
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-primary">¡Correo enviado!</h2>
        <p className="text-sm text-on-surface-variant leading-relaxed">
          Enviamos las instrucciones a
        </p>
        <p className="text-sm font-bold text-primary break-all">{email}</p>
        <p className="text-sm text-on-surface-variant leading-relaxed pt-1">
          Revisa tu bandeja de entrada y haz clic en el enlace para restablecer tu contraseña.
        </p>
      </div>

      <p className="text-xs text-on-surface-variant/70 bg-surface-container rounded-2xl px-4 py-3 w-full">
        ¿No ves el correo? Revisa tu carpeta de <span className="font-bold">spam</span> o correo no deseado.
      </p>

      <Link
        to="/auth/login"
        className="inline-flex items-center gap-2 text-primary font-bold text-sm hover:underline mt-2"
      >
        <ArrowLeft size={16} /> Volver a Iniciar Sesión
      </Link>
    </motion.div>
  );
};