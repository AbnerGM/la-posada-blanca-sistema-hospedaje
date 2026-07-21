// src/pages/EstadiaPage.tsx
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ListaHabitaciones } from "../features/client/components/estadia/ListaHabitaciones";
import { useHabitaciones } from "../features/client/hooks/useEstadia";
import { FiltroBusqueda } from "../features/client/components/estadia/FiltroBusqueda";

export default function EstadiaPage() {
  const [searchParams] = useSearchParams();

  // Si venimos desde la Home con una busqueda ya hecha, la usamos como
  // valor inicial. Si no, empieza vacio (igual que antes).
  const [filtros, setFiltros] = useState({ 
    fechaEntrada: searchParams.get('entrada') || '', 
    fechaSalida: searchParams.get('salida') || '', 
    capacidad: Number(searchParams.get('capacidad')) || 0 
  });

  // Pasamos los filtros al hook. 
  // Cada vez que 'filtros' cambie, el hook dispara la consulta al servidor.
  const { data, loading } = useHabitaciones(filtros);

  return (
    <div className="min-h-screen pt-30 bg-white">
      <div className="max-w-7xl mx-auto px-6 mb-12">
        {/* Al presionar buscar en este componente, se actualiza el estado de arriba */}
        <FiltroBusqueda onFilterChange={setFiltros} valoresIniciales={filtros} />
      </div>

      <div className="bg-background w-full py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h5 className="text-xl md:text-4xl font-serif text-slate-800 mb-10 tracking-tight">
            Habitaciones Disponibles
          </h5>
          
          {loading ? (
            <div className="flex justify-center py-20">
              <p className="text-slate-500 animate-pulse">Consultando disponibilidad...</p>
            </div>
          ) : (
            // Ya no filtramos manualmente con .filter(), el backend ya nos dio los datos filtrados
            <ListaHabitaciones habitaciones={data} />
          )}
        </div>
      </div>
    </div>
  );
}