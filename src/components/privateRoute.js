import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { useAgents } from '../context/agentsContext';

const PrivateRoute = () => {
  const { authLoaded, user } = useAuth();
  const { state } = useAgents();
  const allAgents = state.agents ?? [];

  if (!authLoaded) {
    return <div>Cargando...</div>;
  }

  const knownAgent = allAgents.find(a => a.agent_email === user?.username);
  const isAuthorized = Boolean(user && knownAgent);

  // Si no está autorizado, redirige sin usar useEffect
  if (!isAuthorized) {
    return <Navigate to="/auth-error" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
