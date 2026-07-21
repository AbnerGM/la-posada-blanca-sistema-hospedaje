import { VerifyEmailForm } from '../components/VerifyEmailForm';

export const VerifyEmailPage = () => {
  return (
    <>
      <div className="text-center lg:text-left mb-6">
        <h1 className="text-4xl font-serif text-primary mb-2 font-bold">
          Confirma tu Correo
        </h1>
        <p className="text-on-surface-variant font-medium text-sm">
          Por seguridad, necesitamos verificar tu dirección de correo electrónico.
        </p>
      </div>

      <VerifyEmailForm />
    </>
  );
};