import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthGlobal } from '../features/auth/context/AuthContext';

// Layouts e Historias públicas
import HomePage from '../pages/HomePage'; 
import { MainLayout } from '../layouts/MainLayout'; 
import { DashboardLayout } from '../layouts/DashboardLayout';

// Nuevas páginas públicas
import EstadiaPage from '../pages/EstadiaPage';
import EstadiaDetallePage from '../pages/EstadiaDetallePage';
import { ExperienciasPage } from '../pages/ExperienciasPage';
import { TurismoPage } from '../pages/TurismoPage';
import { BlogPage } from '../pages/BlogPage';

// Módulo Auth
import AuthLayout from '../features/auth/pages/AuthLayout';
import { LoginPage } from '../features/auth/pages/LoginPage';
import { RegisterPage } from '../features/auth/pages/RegisterPage';
import { ForgotPasswordPage } from '../features/auth/pages/ForgotPasswordPage';
import { VerifyEmailPage } from '../features/auth/pages/VerifyEmailPage';
import { ResetPasswordPage } from '../features/auth/pages/ResetPasswordPage';

// Páginas de los Módulos por Rol
import { AdminHome } from '../features/admin/pages/AdminHome';
import { AdminHabitaciones } from '../features/admin/pages/AdminHabitaciones'; 
import { RolesPermisosPage } from '../features/admin/pages/RolesPermisosPage';
import { GestionPersonalPage } from '../features/admin/pages/GestionPersonalPage';
import { HistorialActividadPage } from '../features/admin/pages/HistorialActividadPage';
import { CuentasPagoPage } from '../features/admin/pages/CuentasPagoPage';
import { RecepHome } from '../features/recep/pages/RecepHome';
import { ProfilePage } from '../features/client/pages/ProfilePage';
import { PagoReservaPage } from '../features/client/pages/PagoReservaPage';

import { ReservasPage } from '../features/recep/pages/ReservasPage';
import { PagosPendientesPage } from '../features/recep/pages/PagosPendientesPage';
import { ResumenHabitacionesPage } from '../features/recep/pages/ResumenHabitacionesPage';
import { ToursPage } from '../features/recep/pages/ToursPage';

import { GestionClientesPage } from '../features/recep/pages/GestionClientesPage';
import { AdminPaquetesPage } from '../features/admin/pages/AdminPaquetesPage';


import { PoliticasPrivacidadPage } from '../pages/PoliticasPrivacidadPage';
export const AppRoutes = () => {
  const { isAuthenticated, user, loadingAuth } = useAuthGlobal();

  if (loadingAuth) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-white font-bold text-slate-400 text-xs tracking-widest">
        VERIFICANDO CREDENCIALES...
      </div>
    );
  }

  const postLoginRedirect = user?.rol === 3 ? '/admin' : user?.rol === 2 ? '/recep' : '/perfil';

  return (
    <Routes>
      {/* VISTAS PÚBLICAS */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/estadia" element={<EstadiaPage />} />
        <Route path="/estadia/:id" element={<EstadiaDetallePage />} />
        <Route path="/pago/:id_reserva" element={isAuthenticated && user?.rol === 1 ? <PagoReservaPage /> : <Navigate to="/auth/login" replace />} />
        <Route path="/experiencias" element={<ExperienciasPage />} />
        <Route path="/turismo" element={<TurismoPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/perfil" element={isAuthenticated && user?.rol === 1 ? <ProfilePage /> : <Navigate to="/auth/login" replace />} />
        
<Route path="/politicas-privacidad" element={<PoliticasPrivacidadPage />} />
      </Route>

      {/* PÁGINAS DE AUTENTICACIÓN */}
      <Route 
        path="/auth" 
        element={!isAuthenticated ? <AuthLayout /> : <Navigate to={postLoginRedirect} replace />}
      >
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="verify-email" element={<VerifyEmailPage />} />
        <Route path="reset-password" element={<ResetPasswordPage />} />
      </Route>

      {/* EMBUDO INTELIGENTE */}
      <Route
        path="/dashboard"
        element={
          isAuthenticated ? (
            user?.rol === 3 ? <Navigate to="/admin" replace /> :
            user?.rol === 2 ? <Navigate to="/recep" replace /> :
            <Navigate to="/perfil" replace />
          ) : (
            <Navigate to="/auth/login" replace />
          )
        }
      />

      {/* PANEL PRIVADO - ADMINISTRADOR */}
      <Route 
        path="/admin" 
        element={isAuthenticated && user?.rol === 3 ? <DashboardLayout /> : <Navigate to="/auth/login" replace />}
      >
        <Route index element={<AdminHome />} />
        <Route path="dashboard" element={<AdminHome />} />
        <Route path="habitaciones-gestion" element={<AdminHabitaciones />} />
        <Route path="paquetes" element={<AdminPaquetesPage />} />
        <Route path="roles-permisos" element={<RolesPermisosPage />} />
        <Route path="personal" element={<GestionPersonalPage />} />
        <Route path="historial" element={<HistorialActividadPage />} />
        <Route path="cuentas-pago" element={<CuentasPagoPage />} />
      </Route>

      {/* PANEL PRIVADO - OPERATIVO */}
      <Route 
        path="/recep" 
        element={isAuthenticated && (user?.rol === 3 || user?.rol === 2) ? <DashboardLayout /> : <Navigate to="/auth/login" replace />}
      >
        <Route index element={<RecepHome />} />
        <Route path="reservas" element={<ReservasPage />} />
        <Route path="pagos" element={<PagosPendientesPage />} />
        <Route path="habitaciones" element={<ResumenHabitacionesPage />} />
        <Route path="tours" element={<ToursPage />} />
        <Route path="clientes" element={<GestionClientesPage />} />
      </Route>      

      {/* RUTA COMODÍN */}
      <Route path="*" element={<Navigate to={isAuthenticated ? postLoginRedirect : "/auth/login"} replace />} />
    </Routes>
  );
};