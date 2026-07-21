import { useState, useEffect } from 'react';
import { HabitacionForm } from '../components/HabitacionForm';
import type { Habitacion } from '../types/habitacion';

export const AdminHabitaciones = () => {
  const [habitaciones, setHabitaciones] = useState<Habitacion[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [habitacionAEditar, setHabitacionAEditar] = useState<Habitacion | null>(null);

  const cargar = async () => {
    try {
      // URL cambiada a producción fija con el puerto :3000
      const res = await fetch('https://laposadablanca.duckdns.org:3000/api/habitaciones');
      if (!res.ok) throw new Error("Error al obtener habitaciones");
      
      const data: Habitacion[] = await res.json();
      
      // Aseguramos que siempre haya un array de imágenes
      const dataProcesada = data.map(h => ({
        ...h,
        imagenes: Array.isArray(h.imagenes) ? h.imagenes : []
      }));
      
      setHabitaciones(dataProcesada); 
    } catch (error) {
      console.error("Error al cargar habitaciones:", error);
    }
  };

  const eliminarHabitacion = async (id: number, nombre: string) => {
    const confirmar = window.confirm(`¿Eliminar la habitación "${nombre}"? Esta acción no se puede deshacer.`);
    if (!confirmar) return;

    try {
      const token = localStorage.getItem('token');
      // URL cambiada a producción fija con el puerto :3000
      const res = await fetch(`https://laposadablanca.duckdns.org:3000/api/habitaciones/eliminar/${id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Error al eliminar la habitación');

      cargar(); // recargamos la lista para que ya no aparezca
    } catch (error) {
      console.error('Error al eliminar habitación:', error);
      alert('Ocurrió un error al eliminar la habitación.');
    }
  };

  useEffect(() => { cargar(); }, []);

  return (
    <div className="p-6 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Gestión de Habitaciones</h1>
        <button 
          onClick={() => {
            setHabitacionAEditar(null); // aseguramos que sea modo "crear", no "editar"
            setShowForm(!showForm);
          }} 
          className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700 transition-colors"
        >
          {showForm ? 'Cerrar Formulario' : '+ Nueva Habitación'}
        </button>
      </div>

      {showForm && (
        <div 
          className="fixed inset-0 bg-black/40 flex items-start justify-center overflow-y-auto p-6 z-50"
          onClick={() => { setShowForm(false); setHabitacionAEditar(null); }}
        >
          <div className="w-full max-w-lg mt-10" onClick={(e) => e.stopPropagation()}>
            <HabitacionForm 
              onSuccess={cargar} 
              onClose={() => { setShowForm(false); setHabitacionAEditar(null); }}
              habitacionAEditar={habitacionAEditar || undefined}
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {habitaciones.map((h) => (
          <div key={h.id_habitacion} className="p-5 border border-slate-200 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow">
            
            <div className="h-40 overflow-hidden rounded-xl mb-4 bg-slate-100">
              {h.imagenes.length > 0 ? (
                <img 
                  // Asegúrate de que aquí accedes correctamente a la propiedad 'url_imagen'
                  src={h.imagenes[0].url_imagen} 
                  alt={h.nombre} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-slate-400 text-sm italic">Sin imagen</div>
              )}
            </div>

            <h3 className="font-bold text-lg text-slate-800">{h.nombre}</h3>
            <p className="text-blue-600 font-bold">S/. {h.precio_noche} / noche</p>
            <p className="text-sm text-slate-500 mb-2">Capacidad: {h.capacidad} personas</p>
            
            <div className="text-xs text-slate-400 font-semibold bg-slate-100 inline-block px-2 py-1 rounded-md">
              {h.imagenes.length} fotos disponibles
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => { setHabitacionAEditar(h); setShowForm(true); }}
                className="flex-1 bg-blue-50 text-blue-600 py-2 rounded-lg text-sm font-bold hover:bg-blue-100 transition-colors"
              >
                Editar
              </button>
              <button
                onClick={() => h.id_habitacion && eliminarHabitacion(h.id_habitacion, h.nombre)}
                className="flex-1 bg-red-50 text-red-600 py-2 rounded-lg text-sm font-bold hover:bg-red-100 transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};