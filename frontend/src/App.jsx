import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store } from './app/store';
import { logout, setUser } from './redux/auth/authSlice';
import { authService } from './services/authService';
import './App.css';

import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Dashboard from './pages/User/Dashboard';
import CreateTask from './pages/User/CreateTask';
import EditTask from './pages/User/EditTask';
import MyTasks from './pages/User/MyTasks';
import AdminDashboard from './pages/Admin/AdminDashboard';
import UserManagement from './pages/Admin/UserManagement';
import TaskMonitoring from './pages/Admin/TaskMonitoring';
import ActivityLogs from './pages/Admin/ActivityLogs';
import Analytics from './pages/Admin/Analytics';

import PrivateRoute from './routes/PrivateRoute';
import AdminRoute from './routes/AdminRoute';

const AppRoutes = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!token) return;
    authService.getMe()
      .then((res) => {
        if (res?.user) dispatch(setUser(res.user));
      })
      .catch(() => {
        dispatch(logout());
      });
  }, [token, dispatch]);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/my-tasks" element={<PrivateRoute><MyTasks /></PrivateRoute>} />
      <Route path="/task/create" element={<PrivateRoute><CreateTask /></PrivateRoute>} />
      <Route path="/task/edit/:id" element={<PrivateRoute><EditTask /></PrivateRoute>} />

      <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      <Route path="/admin/users" element={<AdminRoute><UserManagement /></AdminRoute>} />
      <Route path="/admin/tasks" element={<AdminRoute><TaskMonitoring /></AdminRoute>} />
      <Route path="/admin/logs" element={<AdminRoute><ActivityLogs /></AdminRoute>} />
      <Route path="/admin/analytics" element={<AdminRoute><Analytics /></AdminRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <Provider store={store}>
      <Router>
        <AppRoutes />
      </Router>
    </Provider>
  );
}

export default App;
