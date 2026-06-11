const rawApiBaseUrl = import.meta.env.VITE_API_URL || 'https://task-management-rbac.onrender.com/api';
const API_BASE_URL = rawApiBaseUrl.replace(/\/*$/, '').replace(/\/api$/, '') + '/api';

const api = {
  auth: {
    register: `${API_BASE_URL}/auth/register`,
    login: `${API_BASE_URL}/auth/login`,
    logout: `${API_BASE_URL}/auth/logout`,
    getMe: `${API_BASE_URL}/auth/me`,
  },
  tasks: {
    getAll: `${API_BASE_URL}/tasks`,
    create: `${API_BASE_URL}/tasks`,
    getById: (id) => `${API_BASE_URL}/tasks/${id}`,
    update: (id) => `${API_BASE_URL}/tasks/${id}`,
    delete: (id) => `${API_BASE_URL}/tasks/${id}`,
  },
  admin: {
    users: `${API_BASE_URL}/admin/users`,
    deleteUser: (id) => `${API_BASE_URL}/admin/users/${id}`,
    updateUserStatus: (id) => `${API_BASE_URL}/admin/users/${id}/status`,
    allTasks: `${API_BASE_URL}/admin/tasks`,
    deleteTask: (id) => `${API_BASE_URL}/admin/tasks/${id}`,
    activityLogs: `${API_BASE_URL}/admin/activity-logs`,
    analytics: `${API_BASE_URL}/admin/analytics`,
  },
};

const makeRequest = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw error;
  }

  return await response.json();
};

export { api, makeRequest };
