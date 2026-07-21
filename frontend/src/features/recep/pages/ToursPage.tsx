import { ToursTable } from '../components/ToursTable';

export const ToursPage = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Resumen de Tours</h1>
      
      {/* Aquí insertas tu nueva tabla dinámica */}
      <ToursTable />
    </div>
  );
};