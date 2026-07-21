import { useState } from 'react';
import { ClientHistoryTable } from '../components/ClientHistoryTable';
import { useHistorialCliente } from '../hooks/useHistorialCliente';
import { useClientes } from '../hooks/useClientes'; 
import { AlertCircle, User, RefreshCw } from 'lucide-react';

export const GestionClientesPage = () => {
  const [clientId, setClientId] = useState<number | null>(null);
  
  const { clientes, loading: loadingClientes, refresh: refreshLista } = useClientes();
  const { historial, loading: loadingHistorial, error, refresh: refreshHistorial } = useHistorialCliente(clientId);

  // Función consolidada para refrescar ambos lados
  const handleFullRefresh = () => {
    refreshHistorial();
    refreshLista();
  };

  return (
    <div className="flex h-screen p-6 gap-6">
      
      {/* LADO IZQUIERDO */}
      <div className="w-1/3 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 bg-slate-900 text-white font-bold flex items-center justify-between">
          <span>Seleccionar Cliente</span>
          <button onClick={refreshLista} className="hover:text-slate-300">
            <RefreshCw size={14} />
          </button>
        </div>
        
        <div className="overflow-y-auto flex-1">
          {loadingClientes ? (
            <div className="p-4 text-sm text-slate-500">Cargando...</div>
          ) : (
            clientes.map((cli) => (
              <button
                key={cli.id_usuario}
                onClick={() => setClientId(cli.id_usuario)}
                className={`w-full p-4 border-b border-slate-100 flex justify-between items-center transition-all 
                ${clientId === cli.id_usuario ? 'bg-indigo-50 border-l-4 border-l-indigo-500' : 'hover:bg-slate-50'}`}
              >
                <div className="flex items-center gap-3">
                  <User size={16} className="text-slate-400" />
                  <span className="font-medium text-slate-700">{cli.nombre}</span>
                </div>
                
                {(cli.tiene_reserva > 0 || cli.tiene_tour > 0) && (
                  <div 
                    className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse shadow-sm" 
                    title="Tiene servicios activos" 
                  />
                )}
              </button>
            ))
          )}
        </div>
      </div>

      {/* LADO DERECHO */}
      <div className="w-2/3 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-900">Historial del Cliente</h2>
          {clientId && (
            <button 
              onClick={refreshHistorial} 
              className="flex items-center gap-2 text-slate-500 hover:text-slate-900 text-sm transition"
            >
              <RefreshCw size={16} /> Actualizar
            </button>
          )}
        </div>

        {loadingHistorial && <div className="text-center p-10 text-slate-500">Cargando historial...</div>}
        
        {error && (
          <div className="text-center text-rose-600 p-10 flex flex-col items-center">
            <AlertCircle size={32} className="mb-2" /> 
            {error}
          </div>
        )}

        {!clientId && !loadingHistorial && (
          <div className="text-center mt-20 text-slate-400">
            Selecciona un cliente de la lista para ver su historial.
          </div>
        )}

        {clientId && !loadingHistorial && !error && (
          <ClientHistoryTable 
            historial={historial} 
            onRefresh={handleFullRefresh} 
          />
        )}
      </div>
      
    </div>
  );
};