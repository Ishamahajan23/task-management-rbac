import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tasks: [],
  myTasks: [],
  myTasksLoaded: false,
  isLoading: false,
  error: null,
  selectedTask: null,
};

const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setTasks: (state, action) => {
      state.tasks = action.payload;
    },
    setMyTasks: (state, action) => {
      state.myTasks = action.payload;
      state.myTasksLoaded = true;
    },
    addTask: (state, action) => {
      state.myTasks.push(action.payload);
    },
    updateTask: (state, action) => {
      const index = state.myTasks.findIndex(
        (task) => task._id === action.payload._id
      );
      if (index !== -1) {
        state.myTasks[index] = action.payload;
      }
    },
    deleteTask: (state, action) => {
      state.myTasks = state.myTasks.filter(
        (task) => task._id !== action.payload
      );
    },
    setSelectedTask: (state, action) => {
      state.selectedTask = action.payload;
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
  setTasks,
  setMyTasks,
  addTask,
  updateTask,
  deleteTask,
  setSelectedTask,
  setError,
  clearError,
} = taskSlice.actions;

export default taskSlice.reducer;
