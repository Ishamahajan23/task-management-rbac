import { api, makeRequest } from '../utils/api';

export const authService = {
  register: async (data) => {
    return makeRequest(api.auth.register, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  login: async (data) => {
    return makeRequest(api.auth.login, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  logout: async () => {
    return makeRequest(api.auth.logout, {
      method: 'POST',
    });
  },

  getMe: async () => {
    return makeRequest(api.auth.getMe);
  },
};
