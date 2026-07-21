import { User, Bed, Compass } from 'lucide-react';
import { motion } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
  setVista: (vista: string) => void;
  vistaActual: string;
}

export const LayoutPerfil = ({ children, setVista, vistaActual }: LayoutProps) => {
  
  const menuItems = [
    { id: 'habitaciones', label: 'Mis Estadías', icon: Bed },
    { id: 'tours', label: 'Mis Experiencias', icon: Compass },
    { id: 'perfil', label: 'Datos Personales', icon: User },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background">
      <aside className="w-full md:w-72 bg-white border-r border-outline-variant/30 p-8 flex flex-col shadow-sm">
        <h2 className="font-serif text-2xl text-primary mb-10 text-center tracking-wide">Mi Cuenta</h2>
        
        <nav className="flex flex-col gap-2">
          {menuItems.map((item) => {
            const isActive = vistaActual === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setVista(item.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                  isActive 
                    ? 'bg-primary text-white shadow-premium' 
                    : 'text-on-surface-variant hover:bg-primary/5 hover:text-primary'
                }`}
              >
                <item.icon size={20} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </aside>

      <main className="flex-1 p-8 md:p-12 bg-surface-container/30">
        <motion.div 
          key={vistaActual}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-4xl mx-auto"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
};