import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';

const ProtectedRoute = ({ component: Component, ...restOfProps }) => {
  const infoUser = useSelector((state) => state?.auth?.user?.data?.data);
  const isAuthenticated = localStorage.getItem('token') && infoUser?.status !== 2;

  return (
    <Route
      {...restOfProps}
      render={(props) => (isAuthenticated ? <Component {...props} /> : <Redirect to="/login" />)}
    />
  );
};

export default ProtectedRoute;
