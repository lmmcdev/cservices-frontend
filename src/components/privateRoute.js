// src/components/PrivateRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { useAgents } from '../context/agentsContext';

const PrivateRoute = () => {
  const { authLoaded, user } = useAuth();
  const { state } = useAgents();
  const allAgents = state.agents || [];
  if (!authLoaded) return null;

  const knownAgent = allAgents.find(a => a.agent_email === user?.username);

  if (!user || !knownAgent) return <Navigate to="/auth-error" replace />;

  return <Outlet />;
};

export default PrivateRoute;