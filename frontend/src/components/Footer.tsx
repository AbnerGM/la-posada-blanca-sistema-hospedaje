import { Link } from 'react-router-dom';
import { Globe, MapPin, Phone, Mail, ShieldCheck } from 'lucide-react';

export const Footer = () => {
  // Fuerza a la pantalla a subir al inicio cuando haces click en un enlace del footer
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  return (
    <footer className="w-full py-24 bg-surface-container-highest">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-12">

        {/* Columna 1: Branding y Redes */}
        <div className="col-span-1 md:col-span-2">
          <h2 className="text-3xl font-serif font-bold text-primary mb-6">La Posada Blanca</h2>
          <p className="font-sans text-on-surface-variant max-w-sm mb-8 leading-relaxed">
            Refugio de lujo integrado armónicamente con la biósfera de Oxapampa. Su escape hacia la serenidad natural.
          </p>
          <div className="flex gap-4">
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
            >
              <Globe size={20} />
            </a>
          </div>
        </div>

        {/* Columna 2: Enlaces de Navegación */}
        <div>
          <h4 className="text-sm font-bold text-primary uppercase tracking-widest mb-6 font-sans">Enlaces</h4>
          <ul className="flex flex-col gap-4 font-sans text-sm">
            <li>
              <Link to="/" onClick={handleScrollToTop} className="text-on-surface-variant hover:text-secondary transition-colors">
                Inicio
              </Link>
            </li>
            <li>
              <Link to="/experiencias" onClick={handleScrollToTop} className="text-on-surface-variant hover:text-secondary transition-colors">
                Experiencias
              </Link>
            </li>
            <li>
              <Link to="/blog" onClick={handleScrollToTop} className="text-on-surface-variant hover:text-secondary transition-colors">
                Sostenibilidad
              </Link>
            </li>
            <li>
              <Link
                to="/politicas-privacidad"
                onClick={handleScrollToTop}
                className="inline-flex items-center gap-2 text-on-surface-variant hover:text-secondary transition-colors"
              >
                <ShieldCheck size={16} className="text-primary shrink-0" />
                Políticas de privacidad
              </Link>
            </li>
          </ul>
        </div>

        {/* Columna 3: Información de Contacto */}
        <div>
          <h4 className="text-sm font-bold text-primary uppercase tracking-widest mb-6 font-sans">Contacto</h4>
          <ul className="flex flex-col gap-4 font-sans text-sm text-on-surface-variant">
            <li className="flex items-start gap-3">
              <MapPin size={18} className="text-primary mt-0.5 shrink-0" />
              <span>Fundo La Esperanza s/n, Oxapampa, Perú</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={18} className="text-primary shrink-0" />
              <span>+51 987 654 321</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={18} className="text-primary shrink-0" />
              <span>reservas@laposadablanca.com</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Barra Inferior de Copyright */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mt-20 pt-8 border-t border-outline-variant/30 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-on-surface-variant">
        <span>© {new Date().getFullYear()} La Posada Blanca Oxapampa. Todos los derechos reservados.</span>

        <div className="flex items-center gap-6">
          <span className="text-primary font-medium">Español (PE)</span>
          <span className="text-primary font-medium">PEN (S/.)</span>
        </div>
      </div>
    </footer>
  );
};