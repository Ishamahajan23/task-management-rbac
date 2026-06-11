import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { setUser, setToken, setError } from '../../redux/auth/authSlice';
import { authService } from '../../services/authService';

const inputBase =
  'block w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition duration-150 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100';

const FEATURES = [
  { text: 'Role-based access control', desc: 'Separate admin and user permissions' },
  { text: 'Real-time task tracking', desc: 'See progress as it happens' },
  { text: 'Admin analytics dashboard', desc: 'Full visibility into team activity' },
  { text: 'Audit & activity logs', desc: 'Complete history of every action' },
];

const BrandMark = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 46 45" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path fillRule="evenodd" clipRule="evenodd" d="M11.5263 37.6077L11.5344 37.6145C11.5344 37.6145 13.2184 34.6776 17.1841 34.3696C21.1512 34.0612 23.1825 36.3753 23.5477 36.7062C24.4283 37.5672 25.6153 38.0584 26.8919 37.9597C29.3778 37.767 31.2462 35.4349 31.0669 32.7521C30.8888 30.0722 28.7294 28.0513 26.2436 28.245C24.9661 28.3446 23.8586 29.0147 23.1 30.0015L23.0873 30.0057C22.783 30.3871 21.0789 32.9913 17.1123 33.2992C13.147 33.6077 11.0901 30.9616 11.0901 30.9616L11.0837 30.9694C10.1998 30.0928 9.00389 29.5856 7.71188 29.6857C5.22604 29.879 3.35667 32.2124 3.53524 34.8932C3.7138 37.5746 5.87312 39.5932 8.35937 39.4009C9.65097 39.3003 10.7687 38.6151 11.5259 37.6081L11.5263 37.6077Z" fill="url(#lo_g0)"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M20.5817 23.5996L20.5898 23.5969C20.5898 23.5969 19.22 20.4749 21.134 16.7136C23.0463 12.9491 25.9496 12.362 26.3987 12.2225L26.4058 12.2125C27.5533 11.8815 28.5796 11.0719 29.1961 9.86108C30.3959 7.50333 29.5961 4.54247 27.4126 3.24907C25.2294 1.95477 22.4855 2.81626 21.287 5.17494C20.6714 6.38618 20.5911 7.75393 20.949 8.97801L20.9422 8.98995C21.0753 9.47417 22.1756 12.4328 20.262 16.1968C18.3484 19.9586 15.1738 20.3882 15.1738 20.3882L15.1755 20.396C14.0141 20.7213 12.9699 21.5314 12.3466 22.7574C11.1473 25.1142 11.947 28.0774 14.1297 29.3713C16.3145 30.6651 19.0562 29.8009 20.2557 27.444C20.8789 26.2167 20.9521 24.8324 20.5817 23.5992V23.5996Z" fill="url(#lo_g1)"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M39.687 31.5309L39.6887 31.5208C39.6887 31.5208 36.4895 31.6356 34.0547 28.2395C31.6191 24.8487 32.2767 21.7381 32.3366 21.2401L32.3312 21.2287C32.5067 19.9615 32.2312 18.6217 31.4472 17.5293C29.9198 15.4006 27.084 15.0136 25.1151 16.6614C23.1471 18.306 22.7862 21.3663 24.312 23.4933C25.0977 24.5875 26.2285 25.2108 27.4088 25.3452L27.4195 25.3531C27.8824 25.415 30.8351 25.5055 33.2678 28.8977C35.7042 32.291 34.8034 35.6062 34.8034 35.6062L34.8122 35.6072C34.6257 36.8876 34.8977 38.2448 35.6914 39.3506C37.2165 41.4765 40.0522 41.8643 42.0194 40.2166C43.9903 38.5711 44.3501 35.5098 42.825 33.3842C42.0317 32.2796 40.8833 31.6539 39.6874 31.5309H39.687Z" fill="url(#lo_g2)"/>
    <defs>
      <linearGradient id="lo_g0" x1="2.64583" y1="34.9397" x2="29.8978" y2="33.158" gradientUnits="userSpaceOnUse">
        <stop stopColor="#83C17B"/><stop offset="0.509804" stopColor="#5FB56A"/><stop offset="1" stopColor="#169179"/>
      </linearGradient>
      <linearGradient id="lo_g1" x1="14.0919" y1="29.704" x2="28.038" y2="5.70634" gradientUnits="userSpaceOnUse">
        <stop stopColor="#83C17B"/><stop offset="0.509804" stopColor="#5FB56A"/><stop offset="1" stopColor="#169179"/>
      </linearGradient>
      <linearGradient id="lo_g2" x1="42.1847" y1="40.5374" x2="24.6041" y2="19.3571" gradientUnits="userSpaceOnUse">
        <stop stopColor="#83C17B"/><stop offset="0.509804" stopColor="#5FB56A"/><stop offset="1" stopColor="#169179"/>
      </linearGradient>
    </defs>
  </svg>
);

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setLocalError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (!formData.email || !formData.password) {
      setLocalError('Email and password are required');
      return false;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formData.email)) {
      setLocalError('Enter a valid email address');
      return false;
    }
    setLocalError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await authService.login(formData);
      dispatch(setUser(response.user));
      dispatch(setToken(response.token));
      if (response.user.role === 'Admin') navigate('/admin');
      else navigate('/dashboard');
    } catch (err) {
      const errorMsg = err?.message || 'Login failed. Please try again.';
      setLocalError(errorMsg);
      dispatch(setError(errorMsg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-5/12 xl:w-[44%] flex-col justify-between bg-slate-950 relative overflow-hidden px-12 py-14">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -right-32 w-[480px] h-[480px] rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-[480px] h-[480px] rounded-full bg-teal-500/8 blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
              backgroundSize: '28px 28px',
            }}
          />
        </div>

        <div className="relative flex items-center gap-3">
          <BrandMark size={34} />
          <span className="text-white font-bold text-lg tracking-tight">Avidus Interactive</span>
        </div>

        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400 mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Task Management Platform
          </div>
          <h2 className="text-4xl font-bold text-white leading-[1.15] tracking-tight mb-5">
            Manage tasks with<br />
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(90deg, #5FB56A, #169179)' }}>
              clarity and speed.
            </span>
          </h2>
          <p className="text-slate-400 text-[15px] leading-relaxed mb-10 max-w-sm">
            A powerful platform built for modern teams — with role-based access control, real-time tracking, and full audit visibility.
          </p>

          <div className="space-y-4">
            {FEATURES.map(({ text, desc }) => (
              <div key={text} className="flex items-start gap-3">
                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20">
                  <svg className="h-2.5 w-2.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-200">{text}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-xs text-slate-600">© 2026 Avidus Interactive. All rights reserved.</p>
      </div>

      <div className="flex flex-1 items-center justify-center bg-white px-6 py-12 sm:px-12">
        <div className="w-full max-w-[400px] animate-fade-in">
          <div className="flex items-center justify-center gap-2 mb-10 lg:hidden">
            <BrandMark size={30} />
            <span className="text-lg font-bold text-slate-900">Avidus Interactive</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Welcome back</h1>
            <p className="text-slate-500 mt-1.5 text-sm">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                required
                className={inputBase}
                placeholder="you@company.com"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-slate-700">Password</label>
                <Link to="/forgot" className="text-xs font-medium text-emerald-600 hover:text-emerald-700 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  required
                  className={`${inputBase} pr-11`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute inset-y-0 right-3.5 flex items-center text-slate-400 hover:text-slate-600 focus-visible:outline-none transition"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-.512.038-1.014.11-1.504M6.343 6.343A9.963 9.963 0 012 9m20 0a9.963 9.963 0 01-3.536 7.657M15 12a3 3 0 11-6 0 3 3 0 016 0zm6.364-6.364L3.636 20.364" />
                    </svg>
                  ) : (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input id="remember" type="checkbox" className="h-4 w-4 rounded border-slate-300 accent-emerald-600" />
              <span className="text-sm text-slate-600">Remember me for 30 days</span>
            </label>

            {error && (
              <div role="alert" aria-live="assertive" className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                <svg className="mt-0.5 h-4 w-4 shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-lg py-3 text-sm font-semibold text-white transition-all duration-150 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 disabled:opacity-55 disabled:cursor-not-allowed active:scale-[0.99]"
              style={{ background: 'linear-gradient(135deg, #5FB56A 0%, #169179 100%)' }}
            >
              {loading && (
                <svg className="animate-spin h-4 w-4 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
              )}
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
