import { useResumen } from '../hooks/useResumen';

export const ResumenHabitacionesTable = () => {
  // Usamos el hook que creamos anteriormente
  const { resumen, loading, error } = useResumen();

  if (loading) return <div className="p-4 text-center text-slate-500">Cargando inventario...</div>;
  if (error) return <div className="p-4 text-center text-rose-600">{error}</div>;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 text-xs uppercase tracking-wider">
            <th className="px-6 py-4 font-bold">Tipo de Habitación</th>
            <th className="px-6 py-4 font-bold text-center">Disponibles</th>
            <th className="px-6 py-4 font-bold">Mantenimiento</th>
            <th className="px-6 py-4 font-bold text-right">Precio</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {resumen.map((item) => (
            <tr key={item.tipo_habitacion} className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4 font-bold text-slate-800">{item.tipo_habitacion}</td>
              <td className="px-6 py-4 text-center">
                <span className="font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                  {item.disponibles} / {item.total_inventario}
                </span>
              </td>
              <td className="px-6 py-4 text-slate-600">
                {item.en_mantenimiento > 0 ? (
                  <span className="text-rose-600 font-medium">{item.en_mantenimiento} en mant.</span>
                ) : (
                  <span className="text-slate-400">Ninguna</span>
                )}
              </td>
              <td className="px-6 py-4 font-bold text-slate-800 text-right">
                S/ {parseFloat(item.precio).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};