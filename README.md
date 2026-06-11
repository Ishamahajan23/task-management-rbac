# Avidus Interactive — Task Management RBAC

A full-stack role-based task management platform built with React, Node.js, Express, and MongoDB. Admins manage users and monitor all tasks; regular users create and track their own tasks.

---

## Demo Credentials

### Admin Account
| Field    | Value                        |
|----------|------------------------------|
| Email    | `ishamahajan922@gmail.com`   |
| Password | `isha123`                    |
| Role     | Admin                        |

### User Account
| Field    | Value                        |
|----------|------------------------------|
| Email    | `ishapatil@gmail.com`        |
| Password | `isha123`                    |
| Role     | User                         |

> **Note:** You can register a new account from the sign-up page. To promote a user to Admin, log in as an admin and change their role from the User Management page.

---

## Features

### Admin
- Dashboard with system-wide analytics (total users, tasks, completion rate)
- **User Management** — view all registered users, change their role (User ↔ Admin), toggle Active / Inactive status, delete accounts
- **Task Monitoring** — view and delete tasks across all users
- **Activity Logs** — grouped per-user timeline of all login, logout, and task events with action filters and user search
- **Analytics** — completion rate, pending rate, activity breakdown

### User
- Personal dashboard with task stats and completion progress
- Create, view, edit, and delete tasks
- Filter tasks by status (All / Pending / Completed)

---

## Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React 19, Vite, Tailwind CSS v4, Redux Toolkit, React Router v7 |
| Backend   | Node.js, Express.js                 |
| Database  | MongoDB (Mongoose)                  |
| Auth      | JWT (JSON Web Tokens)               |

---

## Project Structure

```
task-management-rbac/
├── backend/
│   └── src/
│       ├── controllers/
│       ├── middleware/
│       ├── models/
│       ├── routes/
│       └── utils/
└── frontend/
    └── src/
        ├── components/
        ├── layouts/
        ├── pages/
        │   ├── Admin/
        │   └── User/
        ├── redux/
        └── services/
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Start the server:

```bash
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_URL=http://localhost:3000/api
```

Start the dev server:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Changing a User's Role

1. Log in with an Admin account
2. Navigate to **User Management** from the sidebar
3. Find the user in the table
4. Under the **Role** column, select **Admin** or **User** from the dropdown
5. The change saves immediately — the user will have admin access on their next login

---

## Environment Variables

### Backend

| Variable     | Description                        |
|--------------|------------------------------------|
| `PORT`       | Port the Express server runs on    |
| `MONGO_URI`  | MongoDB connection string          |
| `JWT_SECRET` | Secret key for signing JWT tokens  |

### Frontend

| Variable       | Description              |
|----------------|--------------------------|
| `VITE_API_URL` | Base URL of the backend API |

---

## License

MIT
