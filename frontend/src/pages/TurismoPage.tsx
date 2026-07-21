import { InfoSostenibilidad } from '../features/client/components/InfoSostenibilidad';

export const TurismoPage = () => {
  return (
    <div className="min-h-screen pt-24 pb-16 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-4xl font-serif font-bold text-slate-800 mb-10">Turismo Sostenible</h1>
        <InfoSostenibilidad />
      </div>
    </div>
  );
};