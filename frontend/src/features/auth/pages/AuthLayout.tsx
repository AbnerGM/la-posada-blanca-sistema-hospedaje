import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Link, Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex font-sans bg-surface">
      {/*  Imagen fija para todo el flujo de Auth */}
      <div className="hidden lg:block w-1/2 relative overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop" 
          alt="La Posada Blanca" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-primary/40 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent"></div>
        
        <div className="absolute bottom-16 left-16 right-16">
          <Link to="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-12 transition-colors font-medium">
            <ArrowLeft size={20} /> Volver al inicio
          </Link>
          <h2 className="text-6xl font-serif text-white font-bold mb-6">La Posada Blanca</h2>
          <p className="text-xl text-white/90 max-w-md font-sans font-light leading-relaxed">
            Descubre lo mejor de la selva del Perú.
          </p>
        </div>
      </div>

      {/* Formulario Dinámico */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16">
        <motion.div 
          layout
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          {/* ◄ Aquí React Router inyectará automáticamente LoginPage, RegisterPage, etc. */}
          <Outlet /> 
        </motion.div>
      </div>
    </div>
  );
}