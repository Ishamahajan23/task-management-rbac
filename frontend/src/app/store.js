import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../redux/auth/authSlice';
import taskReducer from '../redux/task/taskSlice';
import adminReducer from '../redux/admin/adminSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    task: taskReducer,
    admin: adminReducer,
  },
});
