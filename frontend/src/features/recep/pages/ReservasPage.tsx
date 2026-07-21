import { useState } from 'react';
import { ReservasTable } from '../components/ReservasTable';
import { useReservas } from '../hooks/useReservas';
import { NuevaReservaModal } from '../components/NuevaReservaModal';
import { Plus } from 'lucide-react';

export const ReservasPage = () => {
  const [showModal, setShowModal] = useState(false);
  const { reservas, loading, error, refresh } = useReservas();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Historial de Reservas</h1>
          <p className="text-slate-500 text-sm">Consulta y gestiona el historial de reservas de la posada.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition active:scale-95 shadow-sm"
        >
          <Plus size={16} />
          Nueva Reserva
        </button>
      </div>

      <ReservasTable reservas={reservas} loading={loading} error={error} />

      {showModal && (
        <NuevaReservaModal 
          onClose={() => setShowModal(false)} 
          onSuccess={refresh} 
        />
      )}
    </div>
  );
};