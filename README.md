# TaskForge — Java Full Stack Project Management Platform

TaskForge is the polished production-ready evolution of the original SprintDesk project.

**Brand:** TaskForge  
**Repository can remain named `SprintDesk` if you already have that GitHub repository.**  
The UI is branded TaskForge without breaking the existing route/API structure.

## What is included

- React 19 + TypeScript + Vite + Tailwind CSS
- Spring Boot 3.5 + Java 21
- JWT authentication + refresh tokens
- MySQL for users, sprints and tasks
- MongoDB for comments and notifications
- Kanban drag/drop with persisted status + order
- Task create/update/delete
- Editable title, description, status, priority, assignee and due date
- Optimistic UI with rollback on API failure
- Real task notifications for create, move, reorder, assignment, priority, due-date, update, delete and comments
- Notification read/unread/delete
- Analytics dashboard
- Search and filters
- Light/dark theme
- Responsive UI
- Vercel Services configuration for the React frontend + Spring Boot container

## Data architecture

```text
Browser
  │
  ├── React / Vite
  │      │
  │      └── /api/*
  │
  ▼
Spring Boot REST API
  ├── MySQL
  │    ├── users
  │    ├── sprints
  │    └── tasks
  │
  └── MongoDB
       ├── comments
       └── notifications
```

The Vercel application container is stateless. Database state stays in the external MySQL/MongoDB services.

---

# 1. Local testing

## Requirements

- Java 21
- Maven 3.9+
- Node.js 22+
- npm
- MySQL 8+/9+
- MongoDB 8+
- Git

You can use your existing local MySQL and MongoDB. You do **not** need to reinstall them.

## Terminal 1 — MongoDB

If MongoDB is already running, skip this.

```bash
brew services start mongodb-community
```

Verify:

```bash
mongosh --eval 'db.runCommand({ ping: 1 })'
```

## Terminal 2 — MySQL

If MySQL is already running, skip this.

```bash
brew services start mysql
```

Verify:

```bash
mysql -u YOUR_MYSQL_USER -p -e "CREATE DATABASE IF NOT EXISTS sprintdesk;"
```

Use your real MySQL username/password. Do not put the password into Git.

## Terminal 3 — backend

From the project root:

```bash
cd backend

export MYSQL_URL='jdbc:mysql://127.0.0.1:3306/sprintdesk?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC'
export MYSQL_USERNAME='YOUR_MYSQL_USER'
export MYSQL_PASSWORD='YOUR_MYSQL_PASSWORD'
export MONGODB_URI='mongodb://127.0.0.1:27017/sprintdesk'
export JWT_SECRET='local-taskforge-secret-change-this'
export CORS_ALLOWED_ORIGINS='http://localhost:5173'
export PORT=8080

mvn clean spring-boot:run
```

Verify in another terminal:

```bash
curl -i http://localhost:8080/api/health
```

Expected:

```text
HTTP/1.1 200
{"service":"sprintdesk-api","status":"UP"}
```

## Terminal 4 — frontend

From the project root:

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:5173
```

The Vite proxy sends `/api/*` to `http://localhost:8080`.

---

# 2. Login

The development seed creates:

```text
admin / admin123
ashutosh / ashutosh123
```

If your database already contains the users, use the credentials that are currently present in your database.

---

# 3. Full feature test checklist

Test in this exact order.

### A. Authentication

1. Open `/login`.
2. Login.
3. Confirm `/dashboard` opens.
4. Logout.
5. Login again.

### B. Board loading

1. Open **Board**.
2. Confirm all tasks load from MySQL.
3. Refresh the browser.
4. Confirm the same tasks are still present.

### C. Drag/drop persistence

1. Drag a task from Backlog → In Progress.
2. Wait for the task to settle.
3. Open Dashboard and return to Board.
4. Refresh the browser.
5. Confirm the task remains In Progress.
6. Move it to Review.
7. Move it to Done.
8. Move it back to Review.

The status is persisted by the Spring Boot API.

### D. Reordering

1. Put at least two tasks in the same column.
2. Drag one above/below another.
3. Refresh.
4. Confirm the order remains.

### E. Edit

Open a task and choose Edit.

Change:

- title
- description
- status
- priority
- assignee
- due date

Click Save.

Then:

1. close the drawer
2. refresh
3. reopen the task

All changes should remain.

### F. New task

Create a new task with:

- title
- description
- priority
- assignee
- due date

Confirm:

- it appears in Backlog
- it survives refresh
- it exists in MySQL

### G. Delete

Delete a test task.

Refresh.

The task should remain deleted.

### H. Notifications

Open the notification bell after each operation.

Verify notifications for:

- Task created
- Task moved
- Task reordered
- Status updated
- Priority changed
- Due date changed
- Task assigned/reassigned
- Task updated
- Task deleted
- New comment

Notifications are stored in MongoDB.

### I. Comments

Open a task.

Add a comment.

Refresh.

The comment should still exist.

Delete the comment and refresh again.

### J. Analytics

Open Analytics and confirm the charts reflect the current MySQL task data.

### K. Light/dark mode

Toggle the theme.

Refresh.

Confirm the application remains usable in both modes.

---

# 4. Verify MySQL

Run:

```bash
mysql -u YOUR_MYSQL_USER -p sprintdesk
```

Then:

```sql
SELECT id, title, status, priority, assignee_id, due_date, task_order
FROM tasks
ORDER BY status, task_order;
```

You should see the task changes made through the UI.

---

# 5. Verify MongoDB

Run:

```bash
mongosh
```

Then:

```javascript
use sprintdesk
show collections
db.notifications.find().sort({createdAt:-1}).limit(10)
db.comments.find().sort({createdAt:-1}).limit(10)
```

You should see the notifications/comments generated by the UI.

---

# 6. Production build test

Frontend:

```bash
npm run lint
npm run test
npm run build
```

Backend:

```bash
cd backend
mvn clean package
```

Both must finish successfully before pushing to GitHub.

---

# 7. GitHub

From the project root:

```bash
git init
git branch -M main
git add .
git status
git commit -m "feat: production TaskForge full stack"
```

Create your GitHub repository, then:

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
git push -u origin main
```

Before pushing, make sure:

```bash
git status
```

does not show `.env`, passwords, JWT secrets, `node_modules`, or `backend/target`.

---

# 8. Production databases

Your Mac's `localhost` databases cannot be used by a public Vercel deployment.

Create:

- a managed MySQL database
- a MongoDB Atlas (or another managed MongoDB) database

Use TLS/SSL database connections where your provider requires them.

Create the production database/schema:

```text
sprintdesk
```

The application creates/updates the tables with Hibernate `ddl-auto=update`.

---

# 9. Vercel deployment

This repository contains:

```text
vercel.json
backend/Dockerfile.vercel
```

Vercel Services can deploy multiple services in one Vercel project, and Vercel's container support can run HTTP Docker containers such as a Spring Boot API. Persistent database state must remain in external databases.

Import the GitHub repository into Vercel.

Add these **Production** environment variables:

```text
SPRING_PROFILES_ACTIVE=default
MYSQL_URL=YOUR_MANAGED_MYSQL_JDBC_URL
MYSQL_USERNAME=YOUR_MANAGED_MYSQL_USER
MYSQL_PASSWORD=YOUR_MANAGED_MYSQL_PASSWORD
MONGODB_URI=YOUR_MONGODB_ATLAS_URI
JWT_SECRET=YOUR_LONG_RANDOM_SECRET
CORS_ALLOWED_ORIGINS=https://YOUR-PROJECT.vercel.app
PORT=8080
```

Do not use `VITE_` for backend secrets.

Deploy.

---

# 10. Production verification

After Vercel gives you the public domain:

```text
https://YOUR-PROJECT.vercel.app
```

Test:

```text
https://YOUR-PROJECT.vercel.app/
https://YOUR-PROJECT.vercel.app/login
https://YOUR-PROJECT.vercel.app/dashboard
https://YOUR-PROJECT.vercel.app/board
https://YOUR-PROJECT.vercel.app/analytics
https://YOUR-PROJECT.vercel.app/api/health
```

Then perform the same CRUD/drag/notification checklist from the local test.

Open the application from another browser/device. The same task data should be visible because it is stored in the managed databases rather than in the browser.

---

# Security rules

Never commit:

- MySQL password
- MongoDB connection string
- JWT secret
- `.env`
- access/refresh tokens

Only commit `.env.example`.

---

# Important deployment note

Vercel's current container/service model is designed for HTTP application services. It does not provide persistent database volumes for your application container. That is why this project keeps MySQL and MongoDB outside the Vercel container.

For the final public deployment:

```text
GitHub
   ↓
Vercel
   ├── TaskForge React frontend
   └── Spring Boot API container
          ↓
       Managed MySQL
          +
       Managed MongoDB
```
