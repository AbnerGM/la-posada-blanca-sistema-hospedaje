import { useSearchParams } from 'react-router-dom';
import { LoginForm } from '../components/LoginForm';

export const LoginPage = () => {
  const [searchParams] = useSearchParams();
  const sesionExpirada = searchParams.get('sesion') === 'expirada';

  return (
    <>
      <div className="text-center lg:text-left mb-6">
        <h1 className="text-4xl font-serif text-primary mb-2 font-bold">
          Iniciar Sesión
        </h1>
        <p className="text-on-surface-variant font-medium text-sm">
          Por favor, ingresa los datos de su cuenta.
        </p>
      </div>

      {sesionExpirada && (
        <div className="bg-amber-50 border border-amber-200 text-amber-700 text-sm font-semibold px-4 py-3 rounded-xl mb-5">
          Tu sesión expiró. Vuelve a iniciar sesión para continuar.
        </div>
      )}

      <LoginForm />
    </>
  );
};