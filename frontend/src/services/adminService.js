import { api, makeRequest } from '../utils/api';

export const adminService = {
  getAllUsers: async () => {
    return makeRequest(api.admin.users);
  },

  deleteUser: async (id) => {
    return makeRequest(api.admin.deleteUser(id), {
      method: 'DELETE',
    });
  },

  updateUserStatus: async (id, status) => {
    return makeRequest(api.admin.updateUserStatus(id), {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },

  getAllTasks: async () => {
    return makeRequest(api.admin.allTasks);
  },

  deleteTask: async (id) => {
    return makeRequest(api.admin.deleteTask(id), {
      method: 'DELETE',
    });
  },

  getActivityLogs: async () => {
    return makeRequest(api.admin.activityLogs);
  },

  getAnalytics: async () => {
    return makeRequest(api.admin.analytics);
  },
};
