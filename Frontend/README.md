# Ledger — HRMS Frontend

A React + Tailwind frontend for the HRMS Express/Mongoose backend, with separate
Admin and Employee views covering auth, employee records, attendance, leave,
salary, and documents.

## Setup

```bash
npm install
cp .env.example .env   # then edit VITE_API_URL if your backend runs elsewhere
npm run dev
```

This starts the app at `http://localhost:5173`. Make sure your Express backend
(`npm start` in the backend project) is running on the URL set in `.env` —
by default `http://localhost:5000/api`, matching the `PORT` in your `index.js`.

Also enable CORS credentials on the backend if you go with cookie-based auth:

```js
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
```

## Important: API paths are assumed, not confirmed

Only these backend files were available when this frontend was built:
`index.js`, `db.js`, and the Mongoose models (`user`, `attendance`, `leave`,
`salary`, `document`). The actual route files (`auth.route.js`,
`user.route.js`, and any attendance/leave/salary/document routes) were **not**
provided, so every API call in `src/api/*.js` follows a reasonable REST
convention based on the model fields and file names — it has not been
verified against your real endpoints.

Everything the frontend expects from the backend is isolated in `src/api/`,
one file per resource:

| File | Assumed endpoints |
|---|---|
| `api/auth.js` | `POST /auth/register`, `POST /auth/verify-otp`, `POST /auth/resend-otp`, `POST /auth/login`, `POST /auth/logout`, `GET /auth/me` |
| `api/users.js` | `GET/POST /users`, `GET/PUT/DELETE /users/:id` |
| `api/attendance.js` | `GET /attendance`, `GET /attendance/me`, `POST /attendance/checkin`, `POST /attendance/checkout` |
| `api/leave.js` | `GET /leave`, `GET /leave/me`, `POST /leave`, `PUT /leave/:id/status` |
| `api/salary.js` | `GET /salary`, `GET /salary/me`, `POST /salary` (upsert), `PUT /salary/:id` |
| `api/documents.js` | `GET /documents/me`, `GET /documents`, `POST /documents` (multipart), `DELETE /documents/:id` |

If your real routes use different paths or response shapes, you only need to
edit the relevant file in `src/api/` — no page component needs to change.

The login flow also assumes the backend returns `{ token, user }` from
`POST /auth/login`; adjust the destructuring in
`src/context/AuthContext.jsx` if your shape differs. Auth also supports
httpOnly cookies out of the box (`withCredentials: true` in `src/api/client.js`)
in case that's how your `cookie-parser` dependency is being used instead of a
bearer token.

## What's included

- **Auth**: login, registration with OTP verification (matches the `otp` /
  `otpExpires` / `isVerified` fields on your User model), protected routes.
- **Role-based views**: Admin gets an Employees management screen and can
  approve/reject leave and set salaries; Employees get self-service screens
  for their own attendance, leave, salary, and documents.
- **Attendance**: punch clock (check in / check out) and history/log table.
- **Leave**: apply for leave, admin approve/reject with an optional comment.
- **Salary**: per-employee breakdown (basic, HRA, allowances, deductions, CTC)
  for employees; a management table + form for admins.
- **Documents**: upload (multipart, matching the `multer` dependency),
  list, download, delete.
- **Profile**: view record details, edit name/phone/address.

## Design

Styled as a "personnel ledger" — numbered ledger-tab navigation, monospace
type for IDs/timestamps/codes, and stamp-style status pills for
Approved/Pending/Rejected and attendance states. Fonts: Space Grotesk
(display), Inter (body), IBM Plex Mono (data/codes).

## Structure

```
src/
  api/            one file per backend resource
  context/        AuthContext (session state, login/logout)
  components/
    layout/       Sidebar, Topbar, AppLayout, ProtectedRoute
    ui/           Card, Modal, DataTable, StatusPill
  pages/          Login, Register, Dashboard, Employees, Attendance,
                  Leave, Salary, Documents, Profile
```
