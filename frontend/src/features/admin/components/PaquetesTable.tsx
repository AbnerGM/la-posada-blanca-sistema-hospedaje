import type { PaqueteTuristico } from '../types/paquete';

interface Props {
  paquetes: PaqueteTuristico[];
  onRefresh: () => void;
}

export const PaquetesTable = ({ paquetes }: Props) => {
  
  // Verificación de seguridad por si 'paquetes' es nulo o no es array
  if (!Array.isArray(paquetes) || paquetes.length === 0) {
    return (
      <div className="p-8 text-center text-slate-500 bg-white border border-slate-200 rounded-xl">
        No hay paquetes turísticos registrados.
      </div>
    );
  }

  return (
    <div className="overflow-hidden border border-slate-200 rounded-xl shadow-sm bg-white">
      <table className="w-full text-sm text-left">
        <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold">
          <tr>
            <th className="p-4">Nombre</th>
            <th className="p-4">Descripción</th>
            <th className="p-4">Precio</th>
            <th className="p-4">Cupo Disp.</th>
            <th className="p-4">Duración</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {paquetes.map((p, index) => (
            <tr 
              key={(p as any).id_paquete ?? index} 
              className="hover:bg-slate-50 transition-colors"
            >
              <td className="p-4 font-medium text-slate-900">{p.nombre}</td>
              <td className="p-4 text-slate-600 truncate max-w-[200px]">{p.descripcion}</td>
              <td className="p-4 text-slate-700 font-bold">S/ {p.precio}</td>
              <td className="p-4 text-slate-600">{p.cupo_disponible ?? 0}</td>
              <td className="p-4 text-slate-500">{p.duracion ?? 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};