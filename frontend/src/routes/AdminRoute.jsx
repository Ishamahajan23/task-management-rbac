import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { USER_ROLES } from '../utils/constants';

const AdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useSelector(
    (state) => state.auth
  );

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== USER_ROLES.ADMIN) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default AdminRoute;
