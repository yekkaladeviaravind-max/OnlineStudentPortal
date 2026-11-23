# Online Student Portal

A starter project using HTML, CSS, JavaScript, Node.js, Express, MongoDB Atlas, Mongoose and JWT.

## Features
- Student registration
- Student login
- Password hashing with bcryptjs
- JWT-protected student profile
- Logout
- Basic responsive interface

## Requirements
- Node.js and npm
- MongoDB Atlas account (or a local MongoDB server)
- VS Code
- A browser

## Setup

1. Open this project folder in VS Code.
2. Open a terminal in the project root and run:

   ```bash
   npm install
   ```

3. In `backend/.env.example`, replace the sample values with your MongoDB connection string and a long random JWT secret. Rename the file to `.env`.

   Example:
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/StudentPortal?retryWrites=true&w=majority
   JWT_SECRET=replace_this_with_a_long_random_secret
   ```

   In MongoDB Atlas, create a database user and allow your development IP address in Network Access. Do not put your real credentials in source code or upload `.env` to GitHub.

4. Start the backend:

   ```bash
   npm run dev
   ```

   Or use `npm start`.

5. Open `frontend/index.html` using VS Code Live Server. You can also serve the `frontend` folder with another static file server. Do not open the HTML as a `file://` URL if your browser blocks API requests.

6. Register a test student, then log in.

## API endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/students/register` | Register a student |
| POST | `/api/students/login` | Log in and receive a JWT |
| GET | `/api/students/profile` | Get the logged-in student's profile |

For the profile endpoint, send this header:

`Authorization: Bearer <token>`

## Project structure

```text
OnlineStudentPortal/
├── backend/
│   ├── middleware/authMiddleware.js
│   ├── models/Student.js
│   ├── routes/studentRoutes.js
│   ├── .env.example
│   └── server.js
├── frontend/
│   ├── index.html
│   ├── register.html
│   ├── dashboard.html
│   ├── style.css
│   └── script.js
├── package.json
└── README.md
```

## Important security notes

This is a learning project, not a production-ready student information system. Before deploying:
- Use HTTPS.
- Prefer secure, HttpOnly, SameSite cookies over storing JWTs in localStorage.
- Add server-side validation, rate limiting and CSRF protections appropriate to your authentication design.
- Add role-based authorization for admin functions.
- Never expose database credentials or JWT secrets.
- Escape/render user-provided data safely; this project uses DOM text nodes for profile fields.
- Add password reset, email verification, logging and backups as needed.

The starter project intentionally has no admin module, attendance, marks, fees or payment processing yet.
