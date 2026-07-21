import { Link } from 'react-router-dom';
import type { Habitacion } from '../../types/estadia';

interface Props {
  habitacion: Habitacion;
}

export const HabitacionCard = ({ habitacion }: Props) => {
  // Convertimos a booleano por seguridad
  const estaOcupada = !!habitacion.esta_ocupada;

  return (
    <div className={`bg-white rounded-3xl border border-slate-100 shadow-lg overflow-hidden transition-all duration-300 ${estaOcupada ? 'opacity-70 grayscale' : 'hover:shadow-xl'}`}>
      
      {/* Imagen con badge de estado */}
      <div className="relative">
        <img 
          src={habitacion.imagenes?.[0]?.url_imagen || '/placeholder.jpg'} 
          alt={habitacion.nombre}
          className="w-full h-64 object-cover"
        />
        <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${estaOcupada ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
          {estaOcupada ? 'No disponible' : 'Disponible'}
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-serif text-slate-900 mb-2">{habitacion.nombre}</h3>
        <p className="text-slate-600 text-sm mb-4 line-clamp-2">{habitacion.descripcion}</p>
        
        <div className="flex justify-between items-center mt-4">
          <span className="font-bold text-lg">
            S/. {habitacion.precio_noche} 
            <span className="text-sm font-normal text-slate-500">/ noche</span>
          </span>
          
          <span className="text-sm text-slate-600 border border-slate-200 px-3 py-1 rounded-full">
            {habitacion.capacidad} personas
          </span>
        </div>

        {/* Botón de acción */}
        <div className="mt-6">
          <Link 
            to={`/estadia/${habitacion.id_habitacion}`}
            className="w-full block text-center py-3 rounded-xl font-medium transition-colors bg-slate-900 text-white hover:bg-slate-800"
          >
            Ver Detalles y Reservar
          </Link>
        </div>
      </div>
    </div>
  );
};
