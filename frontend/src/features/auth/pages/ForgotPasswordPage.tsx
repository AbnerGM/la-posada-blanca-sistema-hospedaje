import { ForgotPasswordForm } from '../components/ForgotPasswordForm';

export const ForgotPasswordPage = () => {
  return (
    <>
      <div className="text-center lg:text-left mb-6">
        <h1 className="text-4xl font-serif text-primary mb-2 font-bold">
          Recuperar Contraseña
        </h1>
        <p className="text-on-surface-variant font-medium text-sm">
  Ingresa tu correo y te enviaremos un enlace para restablecer tu acceso.
</p>
      </div>

      <ForgotPasswordForm />
    </>
  );
};