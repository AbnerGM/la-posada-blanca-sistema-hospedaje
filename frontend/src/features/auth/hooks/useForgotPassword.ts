import { useState } from 'react';
import api from '../../../api/apiClient';
import Swal from 'sweetalert2';

export const useForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      Swal.fire({ icon: 'warning', title: 'Atención', text: 'Por favor ingresa un correo.' });
      return;
    }

    setLoading(true);

    try {
      await api.post('/auth/solicitar-reset', { email });
      setEnviado(true); 

    } catch (error: any) {
      console.error("Error en solicitud de reset:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'No pudimos conectar con el servidor. Intenta de nuevo.'
      });
    } finally {
      setLoading(false);
    }
  };

  return { 
    email, 
    setEmail, 
    loading,
    enviado,
    handleRequestSubmit 
  };
};