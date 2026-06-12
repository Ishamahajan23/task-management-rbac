import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  users: [],
  allTasks: [],
  activityLogs: [],
  analytics: {
    totalUsers: 0,
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    activeUsers: 0,
  },
  usersLoaded: false,
  tasksLoaded: false,
  logsLoaded: false,
  analyticsLoaded: false,
  isLoading: false,
  error: null,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setUsers: (state, action) => {
      state.users = action.payload;
      state.usersLoaded = true;
    },
    setAllTasks: (state, action) => {
      state.allTasks = action.payload;
      state.tasksLoaded = true;
    },
    setActivityLogs: (state, action) => {
      state.activityLogs = action.payload;
      state.logsLoaded = true;
    },
    setAnalytics: (state, action) => {
      state.analytics = action.payload;
      state.analyticsLoaded = true;
    },
    deleteUser: (state, action) => {
      state.users = state.users.filter(
        (user) => user._id !== action.payload
      );
    },
    updateUserStatus: (state, action) => {
      const user = state.users.find(
        (u) => u._id === action.payload._id
      );
      if (user) {
        user.status = action.payload.status;
      }
    },
    updateUserRole: (state, action) => {
      const user = state.users.find(
        (u) => u._id === action.payload._id
      );
      if (user) {
        user.role = action.payload.role;
      }
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase('auth/logout', () => initialState);
  },
});

export const {
  setLoading,
  setUsers,
  setAllTasks,
  setActivityLogs,
  setAnalytics,
  deleteUser,
  updateUserStatus,
  updateUserRole,
  setError,
  clearError,
} = adminSlice.actions;

export default adminSlice.reducer;
