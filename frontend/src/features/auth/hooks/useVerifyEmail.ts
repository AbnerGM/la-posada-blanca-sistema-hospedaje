import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import cliente from '../../../api/apiClient';

export const useVerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { nombre, correo, contrasena, telefono } = location.state || {};

  const [codigo, setCodigo] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0); 

  useEffect(() => {
    if (!correo) navigate('/auth/register');
  }, []);

  const startTimer = () => {
    // Mata interval anterior si existe
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    startTimeRef.current = Date.now(); 
    setTimer(60);
    setCanResend(false);

    intervalRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const remaining = Math.max(0, 60 - elapsed);

      setTimer(remaining);

      if (remaining <= 0) {
        clearInterval(intervalRef.current!);
        intervalRef.current = null;
        setCanResend(true);
      }
    }, 500); 
  };

  useEffect(() => {
    // Pequeño delay para evitar que Strict Mode lo cancele antes de arrancar
    const timeout = setTimeout(() => startTimer(), 100);
    return () => {
      clearTimeout(timeout);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  const handleOtpChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const newCodigo = [...codigo];
    newCodigo[index] = digit;
    setCodigo(newCodigo);
    if (digit && index < 5) inputsRef.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace') {
      if (!codigo[index] && index > 0) {
        inputsRef.current[index - 1]?.focus();
      } else {
        const newCodigo = [...codigo];
        newCodigo[index] = '';
        setCodigo(newCodigo);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const codeString = codigo.join('');
    if (codeString.length !== 6) {
      Swal.fire({ icon: 'warning', text: 'Ingresa los 6 dígitos del código' });
      return;
    }
    setLoading(true);
    try {
      const response = await cliente.post('/auth/confirmar-registro', {
        nombre, correo, contrasena, telefono, code: codeString
      });
      if (response.status === 201) {
        await Swal.fire({
          icon: 'success',
          title: '¡Registro completado!',
          text: 'Tu cuenta fue creada exitosamente',
          timer: 2000,
          showConfirmButton: false
        });
        navigate('/auth/login');
      }
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Código incorrecto',
        text: error.response?.data?.message || 'El código ingresado no es válido'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReenviarCodigo = async () => {
    if (!canResend) return;
    setLoading(true);
    try {
      await cliente.post('/auth/iniciar-registro', {
        nombre, correo, contrasena, telefono
      });
      setCodigo(['', '', '', '', '', '']);
      startTimer(); // reinicia con nueva ancla de tiempo
      setTimeout(() => inputsRef.current[0]?.focus(), 100);
      await Swal.fire({
        icon: 'success',
        title: 'Código reenviado',
        text: `Hemos enviado un nuevo código a ${correo}`,
        timer: 2500,
        showConfirmButton: false
      });
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        text: error.response?.data?.message || 'Error al reenviar el código'
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    codigo, correo, loading, timer, canResend, inputsRef,
    handleOtpChange, handleOtpKeyDown, handleSubmit, handleReenviarCodigo
  };
};