import { useState, useEffect } from 'react';
import { useAuthGlobal } from '../../../auth/context/AuthContext';
import { fetchDatosCompletosUsuario, actualizarPerfil } from '../../../recep/services/recepService'; 
import type { PerfilCompleto } from '../../../recep/types/recep';
import Swal from 'sweetalert2';

export const DatosPerfil = () => {
  const { user } = useAuthGlobal();
  const [perfil, setPerfil] = useState<PerfilCompleto | null>(null);
  const [loading, setLoading] = useState(true);

  const [editCorreo, setEditCorreo] = useState('');
  const [editTelefono, setEditTelefono] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user?.id) { 
      fetchDatosCompletosUsuario(user.id)
        .then((data: PerfilCompleto) => {
          setPerfil(data);
          setEditCorreo(data.correo || '');
          setEditTelefono(data.telefono || '');
        })
        .catch(err => {
          console.error("Error al cargar:", err);
          Swal.fire('Error', 'No se pudo cargar la información', 'error');
        })
        .finally(() => setLoading(false));
    }
  }, [user?.id]);

  const handleGuardar = async () => {
    if (!editCorreo.includes('@')) {
      Swal.fire('Error', 'Correo no válido', 'error');
      return;
    }
    if (!/^\d{9}$/.test(editTelefono)) {
      Swal.fire('Error', 'El teléfono debe tener 9 dígitos', 'error');
      return;
    }

    if (!perfil?.id_usuario) {
      Swal.fire('Error', 'ID de usuario no identificado', 'error');
      return;
    }

    const cambios = { correo: editCorreo, telefono: editTelefono };

    try {
      await actualizarPerfil(perfil.id_usuario, cambios);
      
      setPerfil({ ...perfil, ...cambios });
      setIsEditing(false);
      Swal.fire('¡Éxito!', 'Perfil actualizado correctamente', 'success');
    } catch (err: any) {
      Swal.fire('Error', 'No se pudo actualizar: ' + (err.message || 'Error desconocido'), 'error');
    }
  };

  if (loading) return <div className="text-center p-10 text-primary">Cargando...</div>;

  return (
    <div className="space-y-8">
      <div className="border-b border-outline-variant/20 pb-6">
        <h2 className="text-3xl font-serif text-primary">Mi Perfil</h2>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-premium border border-outline-variant/10 grid md:grid-cols-2 gap-8">
        <div>
          <label className="text-xs font-bold uppercase text-outline tracking-widest">Nombre Completo</label>
          <p className="text-on-surface font-medium mt-1 p-3 bg-surface-container/50 rounded-xl">
            {perfil?.nombre || 'No disponible'}
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold uppercase text-primary tracking-widest">Datos de contacto</label>
            <button 
              onClick={() => isEditing ? handleGuardar() : setIsEditing(true)} 
              className="text-xs text-primary font-bold underline"
            >
              {isEditing ? 'Guardar Cambios' : 'Editar'}
            </button>
          </div>
          
          <input 
            type="email" 
            value={editCorreo}
            disabled={!isEditing}
            onChange={(e) => setEditCorreo(e.target.value)}
            className="w-full p-3 rounded-xl border border-outline-variant/30 focus:border-primary outline-none"
          />
          <input 
            type="tel" 
            maxLength={9}
            value={editTelefono}
            disabled={!isEditing}
            onChange={(e) => setEditTelefono(e.target.value.replace(/\D/g, ''))}
            className="w-full p-3 rounded-xl border border-outline-variant/30 focus:border-primary outline-none"
          />
        </div>
      </div>
    </div>
  );
};