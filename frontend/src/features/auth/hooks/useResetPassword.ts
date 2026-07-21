import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import cliente from '../../../api/apiClient';
import Swal from 'sweetalert2';

export const getPasswordStrength = (pass: string) => {
  if (pass.length === 0) return { score: 0, label: '', color: '' };
  if (pass.length < 6)   return { score: 1, label: 'Débil',   color: 'bg-red-500 text-red-500' };
  if (pass.length < 10)  return { score: 2, label: 'Media',   color: 'bg-yellow-500 text-yellow-500' };
  return                        { score: 3, label: 'Fuerte',  color: 'bg-green-500 text-green-500' };
};

export const useResetPassword = (token: string) => {
  const [password, setPassword]               = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword]       = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading]                 = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      Swal.fire({ icon: 'error', title: 'Token inválido', text: 'El enlace de recuperación no es válido.' });
      return;
    }
    const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    if (!regexPassword.test(password)) {
      Swal.fire({ icon: 'error', title: 'Contraseña inválida', text: 'Debe tener 8+ caracteres, una mayúscula, una minúscula y un número.' });
      return;
    }
    if (password !== confirmPassword) {
      Swal.fire({ icon: 'error', title: 'No coinciden', text: 'Las contraseñas no son iguales.' });
      return;
    }

    setLoading(true);
    try {
      const response = await cliente.post('/auth/resetear-password', {
        token,
        nuevaContrasena: password,
      });

      await Swal.fire({
        icon: 'success',
        title: '¡Listo!',
        text: response.data.message || 'Tu contraseña ha sido actualizada.',
        confirmButtonColor: '#7c5c3e',
      });

      navigate('/auth/login');
    } catch (error: any) {
      Swal.fire({
  icon: 'error',
  title: 'Oops',  
  text: error.response?.data?.message || 'Error al conectar con el servidor.',
});
    } finally {
      setLoading(false);
    }
  };

  return {
    password, setPassword,
    confirmPassword, setConfirmPassword,
    showPassword, setShowPassword,
    showConfirmPassword, setShowConfirmPassword,
    loading, handleSubmit,
  };
};