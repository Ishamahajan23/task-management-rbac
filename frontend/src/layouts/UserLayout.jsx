import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../redux/auth/authSlice';
import { useState } from 'react';
import ConfirmModal from '../components/ConfirmModal';

const UserLayout = ({ children }) => {
  const [openlogout, setOpenLogout] = useState(false);
  const [loadingLogout, setLoadingLogout] = useState(false);
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
            <h1 className="text-2xl font-bold text-emerald-600 flex items-center gap-2">
              <i className="fa-solid fa-tachometer-alt"></i>
              Avidus Task
            </h1>

            <button
              type="button"
              className="sm:hidden inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label="Toggle user menu"
            >
              <i className={`fa-solid ${menuOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
            </button>

            <div className={`${menuOpen ? 'flex' : 'hidden'} sm:flex sm:items-center sm:gap-4 flex-col sm:flex-row absolute sm:static top-16 left-0 right-0 bg-white sm:bg-transparent p-4 sm:p-0 z-40`}>
              <Link
                to="/dashboard"
                onClick={() => setMenuOpen(false)}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-slate-700 shadow-sm transition hover:bg-emerald-50 hover:text-emerald-700"
              >
                Dashboard
              </Link>
              <Link
                to="/my-tasks"
                onClick={() => setMenuOpen(false)}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-slate-700 shadow-sm transition hover:bg-emerald-50 hover:text-emerald-700"
              >
                My Tasks
              </Link>
              <Link
                to="/task/create"
                onClick={() => setMenuOpen(false)}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-slate-700 shadow-sm transition hover:bg-emerald-50 hover:text-emerald-700"
              >
                Create Task
              </Link>

              <div className="flex flex-col sm:flex-row sm:items-center gap-3 border-t sm:border-t-0 pt-4 mt-4 sm:pt-0 sm:ml-auto">
                <span className="text-sm text-gray-600">
                  <i className="fa-solid fa-user"></i> {user?.name} ({user?.role})
                </span>
                <button
                  onClick={() => setOpenLogout(true)}
                  className="text-white px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 cursor-pointer"
                  disabled={loadingLogout}
                >
                  {loadingLogout ? (
                    <svg className="animate-spin h-4 w-4 text-white mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                    </svg>
                  ) : (
                    'Logout'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>



      <div>


          <ConfirmModal
        open={openlogout}
        title="Logout"
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

export default UserLayout;
