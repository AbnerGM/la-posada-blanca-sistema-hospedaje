import { useState } from 'react';
import type { Habitacion } from '../types/habitacion';

export const HabitacionForm = ({ 
  onSuccess, 
  onClose,
  habitacionAEditar 
}: { 
  onSuccess: () => void, 
  onClose: () => void,
  habitacionAEditar?: Habitacion
}) => {

  const esEdicion = !!habitacionAEditar;

  const [form, setForm] = useState({ 
    nombre: habitacionAEditar?.nombre || '', 
    precio_noche: habitacionAEditar?.precio_noche?.toString() || '', 
    capacidad: habitacionAEditar?.capacidad?.toString() || '', 
    descripcion: habitacionAEditar?.descripcion || '',
    imagenes: [''] // Empezamos con una URL vacía
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Filtramos URLs vacías antes de enviar
    const payload = {
      ...form,
      precio_noche: Number(form.precio_noche),
      capacidad: Number(form.capacidad),
      imagenes: form.imagenes.filter(url => url.trim() !== '')
    };


    const url = esEdicion 
      ? `https://laposadablanca.duckdns.org:3000/api/habitaciones/${habitacionAEditar!.id_habitacion}`
      : 'https://laposadablanca.duckdns.org:3000/api/habitaciones';
    const metodo = esEdicion ? 'PUT' : 'POST';

    try {
      const token = localStorage.getItem('token');

      const res = await fetch(url, {
        method: metodo,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        onSuccess();
        onClose();
      } else {
        const errorData = await res.json();
        alert(errorData.message || `Error al ${esEdicion ? 'editar' : 'crear'} la habitación`);
      }
    } catch (err) { 
      alert("Error de conexión con el servidor"); 
    }
  };

  const handleImagenChange = (index: number, value: string) => {
    const nuevasImagenes = [...form.imagenes];
    nuevasImagenes[index] = value;
    setForm({ ...form, imagenes: nuevasImagenes });
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white border border-slate-200 rounded-xl shadow-lg space-y-4">
      <h2 className="text-lg font-bold text-slate-800">{esEdicion ? 'Editar Habitación' : 'Nueva Habitación'}</h2>
      
      <input className="w-full border p-2 rounded-lg" placeholder="Nombre (ej. Suite 301)" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} required />
      
      <div className="grid grid-cols-2 gap-4">
        <input className="border p-2 rounded-lg" type="number" placeholder="Precio" value={form.precio_noche} onChange={e => setForm({...form, precio_noche: e.target.value})} required />
        <input className="border p-2 rounded-lg" type="number" placeholder="Capacidad" value={form.capacidad} onChange={e => setForm({...form, capacidad: e.target.value})} required />
      </div>
      
      <textarea className="w-full border p-2 rounded-lg" placeholder="Descripción breve" value={form.descripcion} onChange={e => setForm({...form, descripcion: e.target.value})} />

      {/* Sección de Imágenes */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-600">Galería de imágenes (URLs)</label>
        {form.imagenes.map((url, index) => (
          <input 
            key={index}
            className="w-full border p-2 rounded-lg"
            placeholder="https://imagen.com/foto.jpg"
            value={url}
            onChange={e => handleImagenChange(index, e.target.value)}
          />
        ))}
        <button 
          type="button" 
          onClick={() => setForm({...form, imagenes: [...form.imagenes, '']})}
          className="text-xs text-blue-600 font-bold hover:underline"
        >
          + Agregar otra imagen
        </button>
      </div>

      <div className="flex gap-2 pt-4">
        <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700">{esEdicion ? 'Guardar Cambios' : 'Guardar Habitación'}</button>
        <button type="button" onClick={onClose} className="px-4 bg-slate-100 py-2 rounded-lg hover:bg-slate-200">Cancelar</button>
      </div>
    </form>
  );
};