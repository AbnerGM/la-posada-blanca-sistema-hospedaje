import { useSearchParams } from 'react-router-dom';
import { ResetPasswordForm } from '../components/ResetPasswordForm';

export const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';

  return (
    <>
      <div className="text-center lg:text-left mb-6">
        <h1 className="text-4xl font-serif text-primary mb-2 font-bold">
          Nueva Contraseña
        </h1>
        <p className="text-on-surface-variant font-medium text-sm">
          Crea una nueva contraseña de acceso segura para tu cuenta.
        </p>
      </div>

      <ResetPasswordForm token={token} />  {/* ← token va aquí */}
    </>
  );
};