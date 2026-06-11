export const USER_ROLES = {
  ADMIN: 'Admin',
  USER: 'User',
};

export const USER_STATUS = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
};

export const TASK_STATUS = {
  PENDING: 'Pending',
  COMPLETED: 'Completed',
};

export const ACTIVITY_TYPES = {
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  CREATE_TASK: 'CREATE_TASK',
  UPDATE_TASK: 'UPDATE_TASK',
  DELETE_TASK: 'DELETE_TASK',
};

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  USER_DASHBOARD: '/dashboard',
  CREATE_TASK: '/task/create',
  EDIT_TASK: '/task/edit/:id',
  VIEW_TASK: '/task/:id',
  MY_TASKS: '/my-tasks',
  ADMIN_DASHBOARD: '/admin',
  USER_MANAGEMENT: '/admin/users',
  TASK_MONITORING: '/admin/tasks',
  ACTIVITY_LOGS: '/admin/logs',
  ANALYTICS: '/admin/analytics',
};
