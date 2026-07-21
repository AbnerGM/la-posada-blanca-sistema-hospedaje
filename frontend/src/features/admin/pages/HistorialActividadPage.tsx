import { useState, useEffect } from 'react';
import { manejarSesionExpirada } from '../../../utils/sesion';

// URL de localhost cambiada a la de producción fija con el puerto :3000
const API_URL = 'https://laposadablanca.duckdns.org:3000';

interface RegistroActividad {
  id_log: number;
  id_usuario: number;
  nombre_usuario: string;
  accion: string;
  descripcion: string;
  fecha: string;
}

// Convierte la fecha "cruda" que manda el backend en algo legible,
// usando la hora local del navegador (por eso se ve correcta, aunque
// el JSON traiga esa "Z" de UTC al final).
function formatearFecha(fechaISO: string) {
  const fecha = new Date(fechaISO);
  return fecha.toLocaleString('es-PE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export const HistorialActividadPage = () => {
  const [historial, setHistorial] = useState<RegistroActividad[]>([]);
  const [cargando, setCargando] = useState(true);

  const token = localStorage.getItem('token');

  const cargarHistorial = async () => {
    setCargando(true);
    try {
      const res = await fetch(`${API_URL}/api/historial`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401 || res.status === 403) {
        return manejarSesionExpirada();
      }
      if (!res.ok) throw new Error('Error al obtener el historial');
      
      const data = await res.json();
      setHistorial(data.historial);
    } catch (error) {
      console.error('Error al cargar historial:', error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarHistorial();
  }, []);

  if (cargando) {
    return <div className="p-6 text-slate-500">Cargando historial...</div>;
  }

  return (
    <div className="p-6 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Historial de Actividad</h1>
        <button
          onClick={cargarHistorial}
          className="bg-white border border-slate-300 text-slate-700 px-5 py-2 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
        >
          Actualizar
        </button>
      </div>

      <div className="border border-slate-200 rounded-2xl bg-white shadow-sm divide-y divide-slate-100">
        {historial.length === 0 && (
          <div className="p-6 text-slate-400 text-sm">Aún no hay actividad registrada.</div>
        )}

        {historial.map((registro) => (
          <div key={registro.id_log} className="p-4 flex justify-between items-start gap-4">
            <div>
              <p className="text-slate-700 text-sm">
                <span className="font-bold text-slate-800">{registro.nombre_usuario}</span>{' '}
                {registro.descripcion}
              </p>
            </div>
            <span className="text-xs text-slate-400 whitespace-nowrap">
              {formatearFecha(registro.fecha)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};