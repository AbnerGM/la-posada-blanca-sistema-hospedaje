import { useState, type ChangeEvent } from 'react';
import Swal from 'sweetalert2';

export const FiltroBusqueda = ({ onFilterChange, valoresIniciales }: any) => {
  const [filtros, setFiltros] = useState({ 
    fechaEntrada: valoresIniciales?.fechaEntrada || '', 
    fechaSalida: valoresIniciales?.fechaSalida || '', 
    capacidad: valoresIniciales?.capacidad || 0 
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFiltros(prev => ({ 
      ...prev, 
      [name]: name === 'capacidad' ? Number(value) : value 
    }));
  };

  const handleBuscar = () => {
    // 1. Validación de campos obligatorios
    if (!filtros.fechaEntrada || !filtros.fechaSalida) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor, selecciona una fecha de entrada y salida para continuar.',
        confirmButtonColor: '#051911'
      });
      return;
    }

    // 2. Validación lógica de fechas
    if (new Date(filtros.fechaEntrada) >= new Date(filtros.fechaSalida)) {
      Swal.fire({
        icon: 'error',
        title: 'Error en fechas',
        text: 'La fecha de salida debe ser posterior a la de entrada.',
        confirmButtonColor: '#051911'
      });
      return;
    }

    // 3. Envío al componente padre
    onFilterChange(filtros);
  };

  return (
    <div className="bg-[#FAF9F6] rounded-[50px] shadow-sm border border-slate-100 flex flex-col md:flex-row items-center p-2 mx-auto w-full max-w-4xl">
      
      {/* Sección Fechas */}
      <div className="w-full md:flex-1 px-8 py-3 md:border-r border-slate-200">
        <label className="block text-[10px] font-bold text-slate-500 uppercase">Fechas</label>
        <div className="flex gap-2">
          <input 
            type="date" 
            name="fechaEntrada" 
            value={filtros.fechaEntrada}
            className="bg-transparent outline-none text-sm font-medium w-full" 
            onChange={handleChange} 
          />
          <input 
            type="date" 
            name="fechaSalida" 
            value={filtros.fechaSalida}
            className="bg-transparent outline-none text-sm font-medium w-full" 
            onChange={handleChange} 
          />
        </div>
      </div>

      {/* Sección Capacidad */}
      <div className="w-full md:flex-1 px-8 py-3 md:border-r border-slate-200">
        <label className="block text-[10px] font-bold text-slate-500 uppercase">Capacidad</label>
        <input 
          type="number" 
          name="capacidad" 
          placeholder="Añadir huéspedes" 
          min="0"
          value={filtros.capacidad || ''}
          className="w-full bg-transparent outline-none text-sm font-medium" 
          onChange={handleChange} 
        />
      </div>

      {/* Sección Comodidades */}
      <div className="w-full md:flex-1 px-8 py-3">
        <label className="block text-[10px] font-bold text-slate-500 uppercase">Comodidades</label>
        <p className="text-sm font-medium text-slate-800 truncate">Wifi, Piscina...</p>
      </div>

      {/* Botón Buscar */}
      <button 
        onClick={handleBuscar} 
        className="bg-[#051911] text-white p-4 rounded-full hover:bg-black transition-all mt-2 md:mt-0 self-end md:self-auto w-full md:w-auto flex justify-center"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>
    </div>
  );
};