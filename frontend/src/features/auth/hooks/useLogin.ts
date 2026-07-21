import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthGlobal } from '../context/AuthContext';
import { loginService } from '../services/login.service';
import Swal from 'sweetalert2';

export const useLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { loginGlobal } = useAuthGlobal();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await loginService.login({
        correo: email,
        contrasena: password,
      });

     loginGlobal(data.token, data.usuario);

     await loginGlobal(data.token, data.usuario);

await Swal.fire({
  icon: 'success',
  title: '¡Inicio de sesión exitoso!',
  text: `Bienvenido al sistema, ${data.usuario.nombre}`,
  timer: 600,
  showConfirmButton: false,
  background: '#ffffff',
  color: '#1f2937',
});

      if (data.usuario.rol === 1) {
        navigate('/');
      } else {
        navigate('/dashboard');
      }

    } catch (error: any) {
      console.error('Error detectado en el Login:', error);
      const errorMsg = error.response?.data?.message || 'Error de comunicación con el servidor.';

      Swal.fire({
        icon: 'error',
        title: 'No se pudo ingresar',
        text: errorMsg,
        confirmButtonColor: '#3b82f6', 
        background: '#ffffff',         
        color: '#1f2937',             
      });
    } finally {
      setLoading(false);
    }
  };

  return { email, setEmail, password, setPassword, showPassword, setShowPassword, loading, handleSubmit };
};