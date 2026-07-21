import { useState } from 'react';
import { LayoutPerfil } from '../components/perfil/LayoutPerfil';
import { MisHabitaciones } from '../components/perfil/MisHabitaciones';
import { MisTours } from '../components/perfil/MisTours';
import { DatosPerfil } from '../components/perfil/DatosPerfil';
import { useMisDatos } from '../hooks/useMisDatos';
import { useAuthGlobal } from '../../auth/context/AuthContext';

export const ProfilePage = () => {
  const [vista, setVista] = useState('habitaciones');

  const { user } = useAuthGlobal();
  const id_usuario = user?.id || 0;

  const { data, loading } = useMisDatos(id_usuario);

  if (loading) return <div className="p-20 text-center">Cargando tus datos...</div>;

  return (
    <div className="pt-24">
      <LayoutPerfil setVista={setVista} vistaActual={vista}>
        {vista === 'habitaciones' && <MisHabitaciones />}
        {vista === 'tours' && <MisTours data={data} />}
        {vista === 'perfil' && <DatosPerfil />}
      </LayoutPerfil>
    </div>
  );
};