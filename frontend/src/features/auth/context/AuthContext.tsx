import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

// URL de localhost cambiada a la de producción fija con el puerto :3000
const API_URL = 'https://laposadablanca.duckdns.org:3000';

interface UsuarioAuth {
  id: number;
  nombre: string;
  rol: number;
}

interface AuthContextType {
  user: UsuarioAuth | null;
  isAuthenticated: boolean;
  permisos: string[];
  loginGlobal: (token: string, userData: UsuarioAuth) => Promise<void>;
  logoutGlobal: () => void;
  loadingAuth: boolean;
  tienePermiso: (clave: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Pide al backend la lista de permisos (claves) del usuario logueado
async function pedirPermisos(token: string): Promise<string[]> {
  try {
    const res = await fetch(`${API_URL}/api/roles-permisos/mis-permisos`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      console.error('No se pudieron cargar los permisos, status:', res.status);
      return [];
    }

    const data = await res.json();
    return data.permisos as string[];
  } catch (error) {
    console.error('Error al pedir permisos:', error);
    return [];
  }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UsuarioAuth | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [permisos, setPermisos] = useState<string[]>([]);
  const [loadingAuth, setLoadingAuth] = useState(true);

  const logoutGlobal = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setPermisos([]);
    setIsAuthenticated(false);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
        setIsAuthenticated(true);
        pedirPermisos(token).then(setPermisos); 
      } catch (e) {
        console.error("Error al restaurar sesión activa", e);
        logoutGlobal();
      }
    }
    setLoadingAuth(false);
  }, []);

  const loginGlobal = async (token: string, userData: UsuarioAuth) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);

    const permisosDelUsuario = await pedirPermisos(token);
    setPermisos(permisosDelUsuario);
    localStorage.setItem('permisos', JSON.stringify(permisosDelUsuario));

    setIsAuthenticated(true);
  };

  const tienePermiso = (clave: string) => permisos.includes(clave);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, permisos, loginGlobal, logoutGlobal, loadingAuth, tienePermiso }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthGlobal = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuthGlobal debe usarse dentro de un AuthProvider');
  return context;
};