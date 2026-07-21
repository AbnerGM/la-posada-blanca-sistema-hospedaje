import type { HistorialServicio } from '../../../recep/types/recep';

export const MisTours = ({ data }: { data: HistorialServicio[] }) => {
  const tours = data.filter(item => item.tipo === 'Tour');

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-serif text-primary">Mis Experiencias</h2>
      
      {tours.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl border border-outline-variant/30 text-center text-on-surface-variant">
          <p>Aún no has realizado ninguna compra de tours.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {tours.map((t) => (
            <div 
              key={t.id_referencia} 
              className="bg-white p-6 rounded-2xl shadow-premium border border-outline-variant/20 flex flex-col md:flex-row justify-between items-center gap-4 transition-all hover:border-primary/20"
            >
              <div className="flex-1">
                <h3 className="text-lg font-bold text-primary font-serif">{t.servicio}</h3>
                
                <div className="flex flex-col md:flex-row gap-x-6 gap-y-2 mt-3 text-sm">
                  <p className="text-on-surface-variant flex items-center gap-2">
                    Fecha del Tour: <span className="font-bold text-on-surface bg-primary/5 px-2 py-0.5 rounded-md">{t.fecha}</span>
                  </p>
                  
                  <p className="flex items-center gap-2">
                    Estado: 
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      t.estado.toLowerCase() === 'confirmado' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : t.estado.toLowerCase() === 'cancelado'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-orange-100 text-orange-800'
                    }`}>
                      {t.estado}
                    </span>
                  </p>
                </div>
              </div>

              {t.estado.toLowerCase() === 'pendiente' && (
                <button className="bg-primary hover:bg-primary-light text-white px-6 py-2 rounded-xl font-bold text-sm transition-colors shadow-premium whitespace-nowrap">
                  Subir Comprobante →
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};