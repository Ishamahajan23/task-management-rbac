import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../redux/auth/authSlice';
import { useState } from 'react';
import ConfirmModal from '../components/ConfirmModal';

const NAV_LINKS = [
  {
    to: '/dashboard',
    label: 'Dashboard',
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0h6" />
      </svg>
    ),
  },
  {
    to: '/my-tasks',
    label: 'My Tasks',
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
  },
  {
    to: '/task/create',
    label: 'New Task',
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
    ),
  },
];

const UserLayout = ({ children }) => {
  const [openLogout, setOpenLogout] = useState(false);
  const [loadingLogout, setLoadingLogout] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
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

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex h-14 items-center justify-between gap-4">
            <Link to="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <svg width="28" height="28" viewBox="0 0 46 45" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path fillRule="evenodd" clipRule="evenodd" d="M11.5263 37.6077L11.5344 37.6145C11.5344 37.6145 13.2184 34.6776 17.1841 34.3696C21.1512 34.0612 23.1825 36.3753 23.5477 36.7062C24.4283 37.5672 25.6153 38.0584 26.8919 37.9597C29.3778 37.767 31.2462 35.4349 31.0669 32.7521C30.8888 30.0722 28.7294 28.0513 26.2436 28.245C24.9661 28.3446 23.8586 29.0147 23.1 30.0015L23.0873 30.0057C22.783 30.3871 21.0789 32.9913 17.1123 33.2992C13.147 33.6077 11.0901 30.9616 11.0901 30.9616L11.0837 30.9694C10.1998 30.0928 9.00389 29.5856 7.71188 29.6857C5.22604 29.879 3.35667 32.2124 3.53524 34.8932C3.7138 37.5746 5.87312 39.5932 8.35937 39.4009C9.65097 39.3003 10.7687 38.6151 11.5259 37.6081L11.5263 37.6077Z" fill="url(#ul_g0)"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M20.5817 23.5996L20.5898 23.5969C20.5898 23.5969 19.22 20.4749 21.134 16.7136C23.0463 12.9491 25.9496 12.362 26.3987 12.2225L26.4058 12.2125C27.5533 11.8815 28.5796 11.0719 29.1961 9.86108C30.3959 7.50333 29.5961 4.54247 27.4126 3.24907C25.2294 1.95477 22.4855 2.81626 21.287 5.17494C20.6714 6.38618 20.5911 7.75393 20.949 8.97801L20.9422 8.98995C21.0753 9.47417 22.1756 12.4328 20.262 16.1968C18.3484 19.9586 15.1738 20.3882 15.1738 20.3882L15.1755 20.396C14.0141 20.7213 12.9699 21.5314 12.3466 22.7574C11.1473 25.1142 11.947 28.0774 14.1297 29.3713C16.3145 30.6651 19.0562 29.8009 20.2557 27.444C20.8789 26.2167 20.9521 24.8324 20.5817 23.5992V23.5996Z" fill="url(#ul_g1)"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M39.687 31.5309L39.6887 31.5208C39.6887 31.5208 36.4895 31.6356 34.0547 28.2395C31.6191 24.8487 32.2767 21.7381 32.3366 21.2401L32.3312 21.2287C32.5067 19.9615 32.2312 18.6217 31.4472 17.5293C29.9198 15.4006 27.084 15.0136 25.1151 16.6614C23.1471 18.306 22.7862 21.3663 24.312 23.4933C25.0977 24.5875 26.2285 25.2108 27.4088 25.3452L27.4195 25.3531C27.8824 25.415 30.8351 25.5055 33.2678 28.8977C35.7042 32.291 34.8034 35.6062 34.8034 35.6062L34.8122 35.6072C34.6257 36.8876 34.8977 38.2448 35.6914 39.3506C37.2165 41.4765 40.0522 41.8643 42.0194 40.2166C43.9903 38.5711 44.3501 35.5098 42.825 33.3842C42.0317 32.2796 40.8833 31.6539 39.6874 31.5309H39.687Z" fill="url(#ul_g2)"/>
                <defs>
                  <linearGradient id="ul_g0" x1="2.64583" y1="34.9397" x2="29.8978" y2="33.158" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#83C17B"/><stop offset="0.509804" stopColor="#5FB56A"/><stop offset="1" stopColor="#169179"/>
                  </linearGradient>
                  <linearGradient id="ul_g1" x1="14.0919" y1="29.704" x2="28.038" y2="5.70634" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#83C17B"/><stop offset="0.509804" stopColor="#5FB56A"/><stop offset="1" stopColor="#169179"/>
                  </linearGradient>
                  <linearGradient id="ul_g2" x1="42.1847" y1="40.5374" x2="24.6041" y2="19.3571" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#83C17B"/><stop offset="0.509804" stopColor="#5FB56A"/><stop offset="1" stopColor="#169179"/>
                  </linearGradient>
                </defs>
              </svg>
              <span className="text-base font-bold text-slate-900 tracking-tight">Avidus Interactive</span>
            </Link>

            <div className="hidden sm:flex items-center gap-1">
              {NAV_LINKS.map(({ to, label, icon }) => {
                const active = location.pathname === to || (to !== '/dashboard' && location.pathname.startsWith(to));
                return (
                  <Link
                    key={to}
                    to={to}
                    className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                      active
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                    aria-current={active ? 'page' : undefined}
                  >
                    {icon}
                    {label}
                  </Link>
                );
              })}
            </div>

            <div className="hidden sm:flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-xs font-semibold text-emerald-700 select-none">
                  {initials}
                </div>
                <span className="text-sm font-medium text-slate-700">{user?.name}</span>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">{user?.role}</span>
              </div>
              <button
                onClick={() => setOpenLogout(true)}
                disabled={loadingLogout}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-red-50 hover:border-red-200 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-1 disabled:opacity-50 cursor-pointer"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
                </svg>
                Logout
              </button>
            </div>

            <button
              type="button"
              className="sm:hidden flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition cursor-pointer"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              {menuOpen ? (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="border-t border-slate-100 bg-white px-4 pb-4 pt-3 sm:hidden animate-fade-in">
            <div className="space-y-1 mb-3">
              {NAV_LINKS.map(({ to, label, icon }) => {
                const active = location.pathname === to || (to !== '/dashboard' && location.pathname.startsWith(to));
                return (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                      active ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                    aria-current={active ? 'page' : undefined}
                  >
                    {icon}
                    {label}
                  </Link>
                );
              })}
            </div>
            <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-xs font-semibold text-emerald-700">
                  {initials}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">{user?.name}</p>
                  <p className="text-xs text-slate-400">{user?.role}</p>
                </div>
              </div>
              <button
                onClick={() => { setMenuOpen(false); setOpenLogout(true); }}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition cursor-pointer"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        )}
      </nav>

      <ConfirmModal
        open={openLogout}
        title="Sign out"
        message="Are you sure you want to sign out of your account?"
        confirmText="Sign out"
        onConfirm={handleLogout}
        onCancel={() => setOpenLogout(false)}
        loading={loadingLogout}
      />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-6">{children}</main>
    </div>
  );
};

export default UserLayout;
