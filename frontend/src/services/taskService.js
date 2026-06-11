import { api, makeRequest } from '../utils/api';

export const taskService = {
  getAllTasks: async () => {
    return makeRequest(api.tasks.getAll);
  },

  getTaskById: async (id) => {
    return makeRequest(api.tasks.getById(id));
  },

  createTask: async (data) => {
    return makeRequest(api.tasks.create, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateTask: async (id, data) => {
    return makeRequest(api.tasks.update(id), {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  deleteTask: async (id) => {
    return makeRequest(api.tasks.delete(id), {
      method: 'DELETE',
    });
  },
};
