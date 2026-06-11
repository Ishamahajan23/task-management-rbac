# Task Management RBAC Frontend

A React-based frontend application for a role-based task management system with admin dashboard and user management capabilities.

## Features

### User Features
- **Authentication**: Login and registration with email/password
- **Dashboard**: Overview of tasks with statistics (total, completed, pending)
- **Task Management**:
  - Create new tasks with title and description
  - View all personal tasks
  - Edit task details and status
  - Delete tasks
  - Track task status (Pending/Completed)

### Admin Features
- **User Management**: 
  - View all users in the system
  - Delete users
  - Update user status (Active/Inactive)
- **Task Monitoring**:
  - View all tasks created by all users
  - Monitor task status and progress
  - Delete any task
- **Activity Logs**:
  - Track user login/logout activities
  - Monitor task creation, updates, and deletions
  - View detailed activity history
- **Analytics Dashboard**:
  - Total users count
  - Total tasks count
  - Completed vs pending tasks
  - User activity rates
  - Task completion rates

## Project Structure

```
src/
├── pages/
│   ├── Auth/
│   │   ├── Login.jsx           # User login page
│   │   └── Register.jsx        # User registration page
│   ├── User/
│   │   ├── Dashboard.jsx       # User dashboard with stats
│   │   ├── CreateTask.jsx      # Create new task form
│   │   ├── EditTask.jsx        # Edit task form
│   │   └── MyTasks.jsx         # List all user tasks
│   └── Admin/
│       ├── AdminDashboard.jsx  # Admin dashboard overview
│       ├── UserManagement.jsx  # User management page
│       ├── TaskMonitoring.jsx  # Task monitoring page
│       ├── ActivityLogs.jsx    # Activity logs page
│       └── Analytics.jsx       # Analytics dashboard
├── components/                 # Reusable components
├── layouts/
│   ├── UserLayout.jsx          # User layout with navigation
│   └── AdminLayout.jsx         # Admin layout with navigation
├── routes/
│   ├── PrivateRoute.jsx        # Protected route for authenticated users
│   └── AdminRoute.jsx          # Protected route for admin only
├── redux/
│   ├── auth/authSlice.js       # Auth state management
│   ├── task/taskSlice.js       # Task state management
│   └── admin/adminSlice.js     # Admin state management
├── services/
│   ├── authService.js          # Auth API calls
│   ├── taskService.js          # Task API calls
│   └── adminService.js         # Admin API calls
├── utils/
│   ├── api.js                  # API configuration and requests
│   └── constants.js            # App constants and routes
├── app/
│   └── store.js                # Redux store configuration
└── App.jsx                     # Main app with routing

```

## Technology Stack

- **React 19** - UI library
- **React Router 7** - Routing and navigation
- **Redux Toolkit** - State management
- **Tailwind CSS 4** - Styling
- **Vite** - Build tool

## Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   Create a `.env` file in the frontend root directory:
   ```env
   VITE_API_URL=http://localhost:3000/api
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`

## Authentication Flow

### Login
1. Navigate to `/login`
2. Enter email and password
3. On successful login:
   - User data and token stored in Redux and localStorage
   - Redirected to `/dashboard` (users) or `/admin` (admins)

### Registration
1. Navigate to `/register`
2. Fill in name, email, and password
3. New users are created with "User" role by default
4. After registration, automatically logged in and redirected to dashboard

### Logout
- Click logout button in navigation
- User data and token cleared
- Redirected to login page

## Role-Based Access Control

### User Role Permissions
- Access user dashboard and menu
- Create, read, update, delete own tasks
- View own task statistics

### Admin Role Permissions
- Access admin dashboard and all admin pages
- View and manage all users
- View and manage all tasks
- View activity logs
- View system analytics

### Route Protection
- `/login`, `/register` - Public routes
- `/dashboard`, `/my-tasks`, `/task/*` - User routes (requires authentication)
- `/admin/*` - Admin routes (requires admin role)

## API Integration

### Base URL
All API calls use the base URL configured in `.env` (default: `http://localhost:3000/api`)

### API Endpoints Used

**Authentication**
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/logout` - Logout user
- `GET /auth/me` - Get current user

**Tasks**
- `GET /tasks` - Get user tasks
- `POST /tasks` - Create task
- `GET /tasks/:id` - Get task details
- `PUT /tasks/:id` - Update task
- `DELETE /tasks/:id` - Delete task

**Admin**
- `GET /admin/users` - Get all users
- `DELETE /admin/users/:id` - Delete user
- `PUT /admin/users/:id/status` - Update user status
- `GET /admin/tasks` - Get all tasks
- `DELETE /admin/tasks/:id` - Delete task
- `GET /admin/activity-logs` - Get activity logs
- `GET /admin/analytics` - Get system analytics

## Redux State Management

### Auth Slice
```javascript
{
  user: { id, name, email, role, status },
  token: string,
  isLoading: boolean,
  error: string,
  isAuthenticated: boolean
}
```

### Task Slice
```javascript
{
  tasks: Task[],
  myTasks: Task[],
  isLoading: boolean,
  error: string,
  selectedTask: Task
}
```

### Admin Slice
```javascript
{
  users: User[],
  allTasks: Task[],
  activityLogs: Log[],
  analytics: { totalUsers, totalTasks, completedTasks, pendingTasks, activeUsers },
  isLoading: boolean,
  error: string
}
```

## Key Components

### PrivateRoute
Protects routes that require authentication. Redirects unauthenticated users to login.

```jsx
<PrivateRoute>
  <Dashboard />
</PrivateRoute>
```

### AdminRoute
Protects admin-only routes. Redirects non-admin users to dashboard.

```jsx
<AdminRoute>
  <AdminDashboard />
</AdminRoute>
```

### UserLayout
Navigation layout for user pages with user menu and logout button.

### AdminLayout
Navigation layout for admin pages with admin menu links and logout button.

## Error Handling

- Form validation on client side
- API error messages displayed to user
- Error states stored in Redux
- Loading states for async operations
- Fallback messages for empty data

## Responsive Design

All pages are built with Tailwind CSS and are responsive across:
- Desktop (1024px+)
- Tablet (768px - 1024px)
- Mobile (< 768px)

## Build for Production

```bash
npm run build
```

Output will be in the `dist/` directory.

## Development

### Project Setup Commands
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run ESLint
npm run lint
```

## Key Features Implementation

### 1. Token Management
- Tokens stored in localStorage and Redux
- Automatically included in API requests via Authorization header
- Cleared on logout

### 2. User Dashboard Statistics
- Fetches user tasks on component mount
- Calculates real-time statistics
- Displays in card format

### 3. Admin Analytics
- Fetches system-wide analytics
- Calculates completion and activity rates
- Displays in gradient cards

### 4. Activity Tracking
- Logs user login/logout
- Tracks task CRUD operations
- Displays in admin activity logs

## Troubleshooting

### "Not authorized, token missing" Error
- Ensure user is logged in
- Check if token is stored in localStorage
- Clear localStorage and login again

### API Connection Errors
- Verify backend server is running on port 3000
- Check `.env` file has correct `VITE_API_URL`
- Check CORS settings on backend

### Redux DevTools
- Redux DevTools extension can be installed for browser
- Helps debug state changes and actions

## Future Enhancements

- Email notifications for task updates
- Task categories and tags
- Task priority levels
- User profile pages
- Task filtering and sorting
- Dark mode theme toggle
- Real-time updates with WebSocket
- Task assignment to users
- Team collaboration features

## License

MIT

## Support

For issues or questions, please create an issue in the repository.
