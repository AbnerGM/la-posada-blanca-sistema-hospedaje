import { RegisterForm } from '../components/RegisterForm';

export const RegisterPage = () => {
  return (
    <>
      <div className="text-center lg:text-left mb-6">
        <h1 className="text-4xl font-serif text-primary mb-2 font-bold">
          Crear Cuenta
        </h1>
        <p className="text-on-surface-variant font-medium text-sm">
          Regístrate para poder reservar y disfrutar tu estadía.
        </p>
      </div>

      <RegisterForm />
    </>
  );
};