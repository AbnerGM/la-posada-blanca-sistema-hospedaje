import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Users, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();
  const [fechaEntrada, setFechaEntrada] = useState('');
  const [fechaSalida, setFechaSalida] = useState('');
  const [capacidad, setCapacidad] = useState('');

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[95vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop" 
            alt="Oxapampa Forest" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-background/90"></div>
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto flex flex-col items-center">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-7xl text-white font-serif font-bold mb-8 drop-shadow-lg leading-tight"
          >
            Vive la Magia de la Selva Central
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-white/90 font-sans max-w-2xl mb-12 drop-shadow-md"
          >
            Experiencias de lujo en el corazón de la naturaleza salvaje de Oxapampa.
          </motion.p>
          
          <Link to="/estadia">
            <motion.button 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              whileHover={{ y: -4 }}
              className="bg-primary text-white px-10 py-5 rounded-2xl font-bold flex items-center gap-3 shadow-premium-xl text-lg transition-all hover:bg-primary-light"
            >
              Reservar Ahora
              <ArrowRight size={24} />
            </motion.button>
          </Link>
        </div>

        {/* Floating Booking Bar */}
        <div className="absolute bottom-12 left-0 w-full px-6 z-20">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="max-w-5xl mx-auto glass p-3 md:p-6 rounded-3xl md:rounded-full shadow-premium-xl flex flex-col md:flex-row items-center gap-6"
          >
            <div className="flex-1 w-full md:w-auto flex flex-col px-6 py-2 border-b md:border-b-0 md:border-r border-outline-variant/30">
              <span className="text-[10px] md:text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1 font-sans">Ubicación</span>
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-primary" />
                <span className="text-sm md:text-base font-semibold">Oxapampa, Pasco</span>
              </div>
            </div>
            
            <div className="flex-1 w-full md:w-auto flex flex-col px-6 py-2 border-b md:border-b-0 md:border-r border-outline-variant/30">
              <span className="text-[10px] md:text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1 font-sans">Fechas</span>
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={fechaEntrada}
                  onChange={(e) => setFechaEntrada(e.target.value)}
                  className="bg-transparent outline-none text-sm md:text-base font-medium text-on-surface-variant w-full"
                />
                <input
                  type="date"
                  value={fechaSalida}
                  onChange={(e) => setFechaSalida(e.target.value)}
                  className="bg-transparent outline-none text-sm md:text-base font-medium text-on-surface-variant w-full"
                />
              </div>
            </div>

            <div className="flex-1 w-full md:w-auto flex flex-col px-6 py-2">
              <span className="text-[10px] md:text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1 font-sans">Huéspedes</span>
              <div className="flex items-center gap-2">
                <Users size={16} className="text-primary flex-shrink-0" />
                <input
                  type="number"
                  min="0"
                  placeholder="¿Cuántos viajan?"
                  value={capacidad}
                  onChange={(e) => setCapacidad(e.target.value)}
                  className="bg-transparent outline-none text-sm md:text-base font-medium text-on-surface-variant w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
            </div>

            <button 
              onClick={() => {
                const params = new URLSearchParams();
                if (fechaEntrada) params.set('entrada', fechaEntrada);
                if (fechaSalida) params.set('salida', fechaSalida);
                if (capacidad) params.set('capacidad', capacidad);
                navigate(`/estadia?${params.toString()}`);
              }}
              className="bg-primary hover:bg-primary-light text-white p-5 rounded-full shadow-premium transform hover:scale-110 transition-all w-full md:w-auto flex justify-center items-center"
            >
              <Search size={24} />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Featured Content */}
      <section className="py-32 px-6 max-w-7xl mx-auto bg-background">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-serif mb-6 text-primary">Un refugio diseñado para ti</h2>
          <p className="text-on-surface-variant max-w-2xl mx-auto font-sans leading-relaxed">
            Descubre la combinación perfecta entre lujo y naturaleza. Nuestras cabañas están diseñadas con materiales locales de la más alta calidad.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: 'Sostenibilidad', desc: 'Construcciones ecológicamente responsables.', img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=600&auto=format&fit=crop' },
            { title: 'Exclusividad', desc: 'Privacidad absoluta en medio del bosque.', img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=600&auto=format&fit=crop' },
            { title: 'Aventura', desc: 'Tours guiados a cataratas y fincas.', img: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=600&auto=format&fit=crop' },
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="group bg-surface-container rounded-3xl overflow-hidden shadow-premium hover:shadow-premium-xl transition-all"
            >
              <div className="h-64 overflow-hidden">
                <img src={item.img} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-serif mb-3 text-primary">{item.title}</h3>
                <p className="text-on-surface-variant text-sm font-sans mb-6">{item.desc}</p>
                <Link to="/login" className="text-primary font-bold text-sm flex items-center gap-2 group-hover:gap-3 transition-all">
                  Explorar más <ArrowRight size={16} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}