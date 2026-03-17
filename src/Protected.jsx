import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Appcontext } from './App';

const Protected = () => {
  const { session, guest } = useContext(Appcontext);

  if (!session && !guest) return <Navigate to="/" />;

  return <Outlet />;
};

export default Protected;