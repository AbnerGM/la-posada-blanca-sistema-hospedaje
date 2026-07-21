import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Jala el Navbar Global fijado arriba */}
      <Navbar />

      {/* Contenido Dinámico de las páginas públicas */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Jala el Footer Global al fondo */}
      <Footer />
    </div>
  );
};