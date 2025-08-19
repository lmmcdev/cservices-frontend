// src/routes/PrivateRoute.jsx
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/authContext';

// Pequeño loader visual (usa el tuyo si ya tienes)
function FullscreenLoader() {
  return (
    <div style={{
      display:'flex', alignItems:'center', justifyContent:'center',
      height:'100vh', fontFamily:'sans-serif'
    }}>
      Cargando…
    </div>
  );
}

/**
 * Protege rutas:
 * - Espera a authLoaded
 * - Si authError -> /auth-error
 * - Si no hay user -> /login (o tu pantalla de login)
 * - Si se pasan allowedGroups, valida pertenencia
 */
export default function PrivateRoute({ allowedGroups }) {
  const { authLoaded, user, groups = [], authError } = useAuth();
  const location = useLocation();

  // 1) Aún cargando el estado de autenticación -> muestra loader y no redirijas
  if (!authLoaded) {
    return <FullscreenLoader />;
  }

  // 2) Si hubo un error explícito de auth (MSAL), lleva a una pantalla de error
  if (authError) {
    return (
      <Navigate
        to="/auth-error"
        replace
        state={{ message: authError, from: location }}
      />
    );
  }

  // 3) Si ya cargó y no hay usuario -> manda al login (o a tu pantalla pública)
  if (!user?.username) {
    return (
      <Navigate
        to="/auth-error"
        replace
        state={{ from: location }}
      />
    );
  }

  // 4) (Opcional) Validación por grupos si se especifican
  if (Array.isArray(allowedGroups) && allowedGroups.length > 0) {
    const isAllowed = groups.some(g => allowedGroups.includes(g));
    if (!isAllowed) {
      return (
        <Navigate
          to="/404"
          replace
          state={{ from: location }}
        />
      );
    }
  }

  // 5) Autorizado → renderiza la ruta hija
  return <Outlet />;
}
