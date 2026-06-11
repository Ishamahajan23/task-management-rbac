import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { setUser, setToken, setError } from '../../redux/auth/authSlice';
import { authService } from '../../services/authService';


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
    // simple email pattern
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

      // Navigate based on role
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-emerald-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <header className="mb-6 text-center">
          <div className="mx-auto mb-4 w-16 h-16 flex items-center justify-center rounded-full bg-emerald-200">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#065f46" />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-emerald-800">Welcome back</h1>
          <p className="text-sm text-emerald-600">Sign in to continue to Avidus Tasks</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label htmlFor="email" className="text-sm font-medium text-emerald-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              aria-label="Email"
              required
              className="mt-1 block w-full px-4 py-2 rounded-md border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-300"
              placeholder="you@company.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="text-sm font-medium text-emerald-700">
              Password
            </label>
            <div className="relative mt-1">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                aria-label="Password"
                required
                className="block w-full px-4 py-2 rounded-md border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute inset-y-0 right-2 flex items-center px-2 text-emerald-600"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                 <i class="fa-regular fa-eye"></i>
                ) : (
                  <i class="fa-regular fa-eye-slash"></i>
                )}
              </button>
            </div>
          </div>

          {error && (
            <div role="alert" aria-live="assertive" className="text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="flex items-center justify-between flex-row gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <input id="remember" type="checkbox" className="h-4 w-4 text-emerald-600 rounded border-emerald-300" />
              <label htmlFor="remember" className="text-sm text-emerald-600">Remember me</label>
            </div>
            <Link to="/forgot" className="text-sm text-emerald-600 hover:underline">Forget your password?</Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 rounded-md disabled:opacity-60"
          >
            {loading && (
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
              </svg>
            )}
            <span>{loading ? 'Signing in...' : 'Sign in'}</span>
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-emerald-600">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-emerald-700 hover:underline">Create one</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
