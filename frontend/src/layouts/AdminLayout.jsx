import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../redux/auth/authSlice';
import { useState } from 'react';
import ConfirmModal from '../components/ConfirmModal';

const AdminLayout = ({ children }) => {
  const [loadingLogout, setLoadingLogout] = useState(false);
  const [openlogout, setOpenLogout] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    setLoadingLogout(true);
    try {
      dispatch(logout());
      navigate('/login');
    } finally {
      setLoadingLogout(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 to-emerald-100">
      {/* Navigation */}
      <nav className="bg-white shadow-md">
        <div className="max-w-8xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <h1 className="lg:text-2xl font-bold text-emerald-600 flex items-center gap-2">
                <i className="fa-solid fa-tachometer-alt"></i>
                Avidus Admin
              </h1>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">Admin panel</span>
            </div>

            <button
              type="button"
              className="sm:hidden inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label="Toggle admin menu"
            >
              <i className={`fa-solid ${menuOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
            </button>

            <div className={`${menuOpen ? 'flex' : 'hidden'} sm:flex sm:items-center sm:gap-3 flex-col sm:flex-row absolute sm:static top-16 left-0 right-0 bg-white sm:bg-transparent p-4 sm:p-0 z-40`}>
              <Link
                to="/admin"
                onClick={() => setMenuOpen(false)}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-slate-700 shadow-sm transition hover:bg-emerald-50 hover:text-emerald-700"
              >
                <i className="fa-solid fa-house"></i>
                Dashboard
              </Link>
              <Link
                to="/admin/users"
                onClick={() => setMenuOpen(false)}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-slate-700 shadow-sm transition hover:bg-emerald-50 hover:text-emerald-700"
              >
                <i className="fa-solid fa-users"></i>
                Users
              </Link>
              <Link
                to="/admin/tasks"
                onClick={() => setMenuOpen(false)}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-slate-700 shadow-sm transition hover:bg-emerald-50 hover:text-emerald-700"
              >
                <i className="fa-solid fa-list-check"></i>
                Tasks
              </Link>
              <Link
                to="/admin/logs"
                onClick={() => setMenuOpen(false)}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-slate-700 shadow-sm transition hover:bg-emerald-50 hover:text-emerald-700"
              >
                <i className="fa-solid fa-history"></i>
                Logs
              </Link>
              <Link
                to="/admin/analytics"
                onClick={() => setMenuOpen(false)}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-slate-700 shadow-sm transition hover:bg-emerald-50 hover:text-emerald-700"
              >
                <i className="fa-solid fa-chart-line"></i>
                Analytics
              </Link>

              <div className="flex flex-col sm:flex-row sm:items-center gap-3 border-t sm:border-t-0 pt-4 sm:pt-0 sm:ml-auto">
                <span className="text-sm text-gray-600">
                  <i className="fa-solid fa-user"></i> {user?.name} ({user?.role})
                </span>
                <button
                  onClick={() => setOpenLogout(true)}
                  className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 flex items-center gap-2 cursor-pointer"
                  disabled={loadingLogout}
                >
                  {loadingLogout && (
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                    </svg>
                  )}
                  <span>{loadingLogout ? 'Logging out...' : 'Logout'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div>
    
          <ConfirmModal
        open={openlogout}
        title="Confirm Logout"
        message="Are you sure you want to logout?"
        onConfirm={handleLogout}
        onCancel={() => setOpenLogout(false)}
        loading={loadingLogout}
        confirmText="Logout"
      />
      </div>


      {/* Main Content */}
      <main className="max-w-8xl mx-auto p-4">{children}</main>
    </div>
  );
};

export default AdminLayout;
