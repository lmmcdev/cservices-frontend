// src/components/PrivateRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { useAgents } from '../context/agentsContext';

const PrivateRoute = () => {
  const { authLoaded, user } = useAuth();
  const { state } = useAgents();

  if (!authLoaded) return null;

  const knownAgent = state.agents.find(a => a.agent_email === user?.username);

  if (!user || !knownAgent) return <Navigate to="/auth-error" replace />;

  return <Outlet />;
};

export default PrivateRoute;