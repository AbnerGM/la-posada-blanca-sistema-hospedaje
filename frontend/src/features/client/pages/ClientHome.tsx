  import { useAuthGlobal } from '../../auth/context/AuthContext';
  import { Bookmark, CreditCard, History } from 'lucide-react';
  import { ListaExperiencias } from '../components/experiencia/ListaExperiencias'; // IMPORTA EL COMPONENTE

  export const ClientHome = () => {
    const { user } = useAuthGlobal();

    return (
      <div className="space-y-8"> {/* Aumenté el espacio para separar secciones */}
        <header>
          <h1 className="text-3xl font-bold text-slate-800">¡Hola, {user?.nombre}!</h1>
          <p className="text-slate-500">Bienvenido a tu panel personal de Hormaq.</p>
        </header>

        {/* Tarjetas de Resumen */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="bg-blue-50 p-4 rounded-xl text-blue-600"><Bookmark /></div>
           
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="bg-emerald-50 p-4 rounded-xl text-emerald-600"><CreditCard /></div>
            
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="bg-amber-50 p-4 rounded-xl text-amber-600"><History /></div>
            
          </div>
        </div>

        {/* SECCIÓN NUEVA: Aquí aparecerán los tours que creaste en el Admin */}
        <section>
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Descubre nuestras experiencias</h2>
          <ListaExperiencias />
        </section>
      </div>
    );
  };