/* eslint-disable react/prop-types */
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ element: Component }) {
  const isAuthenticated = Boolean(localStorage.getItem('token')); // Replace with actual auth logic

  return isAuthenticated ? <Component /> : <Navigate to='/sign-in' />;
}

export default ProtectedRoute;
