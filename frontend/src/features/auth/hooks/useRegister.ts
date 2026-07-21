import { useState } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { dniService } from '../services/dni.service';
import cliente from '../../../api/apiClient';

export const useRegister = () => {
  const navigate = useNavigate();

  const [dni, setDni] = useState('');
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verifyingDni, setVerifyingDni] = useState(false);

  const formatName = (fullName: string) =>
    fullName.toLowerCase().split(' ').filter(w => w.length > 0)
      .map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  const handleVerificarDni = async () => {
    if (dni.length !== 8) {
      Swal.fire({ icon: 'warning', title: 'Oops...', text: 'El DNI debe tener 8 dígitos' });
      return;
    }
    setVerifyingDni(true);
    try {
      const data = await dniService.verificar(dni);
      if (data?.nombre) {
        const nombreFormateado = formatName(data.nombre.replace(/[,.]/g, ''));
        setNombre(nombreFormateado);
        Swal.fire({ icon: 'success', title: '¡DNI Verificado!', text: `Bienvenido, ${nombreFormateado}`, timer: 2000, showConfirmButton: false });
      } else {
        Swal.fire({ icon: 'error', title: 'Error', text: 'DNI no encontrado' });
      }
    } catch {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Error al conectar con el servicio' });
    } finally {
      setVerifyingDni(false);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!nombre) {
      Swal.fire({ icon: 'warning', text: 'Verifica tu DNI primero' });
      return;
    }
    if (!/^9\d{8}$/.test(telefono)) {
      Swal.fire({ icon: 'warning', title: 'Teléfono inválido', text: 'Debe empezar con 9 y tener 9 dígitos.' });
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
      const response = await cliente.post('/auth/iniciar-registro', {
        nombre, correo: email, contrasena: password, telefono
      });
      if (response.status === 200) {
        navigate('/auth/verify-email', {
          state: { nombre, correo: email, contrasena: password, telefono }
        });
      }
    } catch (error: any) {
      Swal.fire({ icon: 'error', text: error.response?.data?.message || 'Error al iniciar registro' });
    } finally {
      setLoading(false);
    }
  };

  return {
    dni, setDni, nombre, setNombre, telefono, setTelefono,
    email, setEmail, password, setPassword,
    confirmPassword, setConfirmPassword,
    showPassword, setShowPassword, loading, verifyingDni,
    handleVerificarDni, handleSubmit
  };
};