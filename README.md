# PrimeTrade — Quick README

## Deployment

- Frontend deployed: https://primetradeai-frontend.vercel.app/
- Backend hosted on Render (free tier);

## **the free plan may sleep and cause downtime after inactivity.**

Admin access (testing)

- A seeded super-user exists for testing: `admin@gmail.com` with password `admin` — this account is `super-admin` and can create users, change roles, and delete users.
  Repo layout (relative paths):

- `server/` — backend (Express + Mongoose)
- `frontend/` — static UI (HTML/CSS/JS)

Quick start — backend

1. Open a terminal and change into the server directory:

```cmd
cd server
```

2. Install and run:

```cmd
npm install
node src/server.js
```

3. Minimal `.env` (place in `server/`):

```
MONGODB_URI=mongodb://localhost:27017/primetrade
PORT=8080
JWT_SECRET=your_jwt_secret_here
```

Server notes:

- Server runs on `http://localhost:8080` by default.
- Swagger UI: `http://localhost:8080/api-docs`.

Quick start — frontend

- Serve the `frontend/` folder with a static server, or add `express.static` in the backend.

```cmd
cd frontend
python -m http.server 5500
# open http://127.0.0.1:5500/login.html
```

API summary

- Auth: `POST /auth/register`, `POST /auth/login` (returns `{ token }`)
- Tasks: `POST /tasks`, `GET /tasks`, `GET /tasks/:id`, `PATCH /tasks/:id`, `DELETE /tasks/:id`
- Admin: `GET/POST/PUT/DELETE /admin/users` (protected)

### **_Note: The frontend is made with help of no-code tool COPILOT._**

Fix / Change list (TODO)

1. Pagination

- Fix: add `?page=&limit=` to list endpoints. Implement `skip`/`limit` or cursor pagination and return `total`.

2. Admin creating tasks for users

- Fix: add `POST /admin/users/:id/tasks` (admin-only) to create tasks for a specific user. Validate `:id` and require admin role.

3. Enforce email/username uniqueness on update

- Fix: in `PUT /admin/users/:id` check `email`/`username` collisions (`findOne`) and return 409 if duplicate before saving.

4. Admin / super-admin rules

- Fix: only `super-admin` can create or promote admins. Protect role changes in `PUT /admin/users/:id` so `role` can be changed only by `super-admin`.

5. Permissions for tasks

- Fix: enforce policy in `updateTask`/`deleteTask`: only task owner or allowed roles (explicit) can modify a task. Add admin-only admin endpoints if admins should manage others.

6. Update-user method

- Endpoint: `PUT /admin/users/:id`
- Body: `{ username, email, password, role }` — allow `role` change only for `super-admin`.
- Implementation notes: if `password` present, load user, set `.password` and `await user.save()` so pre-save hook hashes it; otherwise use `findByIdAndUpdate` with `runValidators`.

7. JWT storage note

- Change: localStorage is insecure for production. Use httpOnly cookies or short-lived tokens + refresh tokens for browsers.
