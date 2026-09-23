<div align="center">

# ⚡ TaskGenZ

### Modern Java Full Stack Project & Delivery Management Platform

<p>

  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React"/>

  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>

  <img src="https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite"/>

  <img src="https://img.shields.io/badge/Spring%20Boot-3.5-6DB33F?style=for-the-badge&logo=springboot&logoColor=white" alt="Spring Boot"/>

  <img src="https://img.shields.io/badge/Java-21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white" alt="Java"/>

  <img src="https://img.shields.io/badge/MySQL-9.6-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL"/>

  <img src="https://img.shields.io/badge/MongoDB-8-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB"/>

</p>

<p>

  <img src="https://img.shields.io/badge/JWT-Authentication-000000?style=flat-square&logo=jsonwebtokens&logoColor=white"/>

  <img src="https://img.shields.io/badge/REST-API-FF6F00?style=flat-square"/>

  <img src="https://img.shields.io/badge/TailwindCSS-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white"/>

  <img src="https://img.shields.io/badge/Zustand-State-443E38?style=flat-square"/>

  <img src="https://img.shields.io/badge/React%20Query-Data%20Fetching-FF4154?style=flat-square"/>

</p>

<br/>

<a href="https://github.com/ashudubeyvns/TaskGenZ">

  <img src="https://readme-typing-svg.demolab.com?font=JetBrains+Mono&weight=700&size=24&pause=1000&color=A855F7&center=true&vCenter=true&width=800&lines=Plan+%E2%86%92+Build+%E2%86%92+Track+%E2%86%92+Deliver;Modern+Java+Full+Stack+Workspace;React+%2B+Spring+Boot+%2B+MySQL+%2B+MongoDB;Built+for+real+world+project+management" alt="Typing animation"/>

</a>

<br/>

**TaskGenZ** is a production-oriented full-stack project management workspace built with

**React, TypeScript, Spring Boot, Java, MySQL and MongoDB.**

It combines a modern Kanban workflow, authentication, task management,
notifications, comments, analytics and persistent backend data into one application.

<br/>

<a href="https://github.com/ashudubeyvns/TaskGenZ">

  <img src="https://img.shields.io/github/stars/ashudubeyvns/TaskGenZ?style=for-the-badge&logo=github&label=Stars" />

</a>

<a href="https://github.com/ashudubeyvns/TaskGenZ">

  <img src="https://img.shields.io/github/forks/ashudubeyvns/TaskGenZ?style=for-the-badge&logo=github&label=Forks" />

</a>

<a href="https://github.com/ashudubeyvns/TaskGenZ">

  <img src="https://img.shields.io/github/last-commit/ashudubeyvns/TaskGenZ?style=for-the-badge&label=Last%20Commit" />

</a>

</div>

---

## ✨ Why TaskGenZ?

TaskGenZ is designed as a **real Java Full Stack application**, not just a frontend demo.

The platform provides:

- 🔐 JWT authentication with refresh tokens
- 📋 Kanban task management
- 🖱️ Drag-and-drop task workflow
- 🔄 Persistent task ordering
- 👥 User assignment
- 🎯 Priority management
- 📅 Due-date management
- 💬 Task comments
- 🔔 Real-time-style application notifications
- 📊 Analytics dashboard
- 🔎 Search and filtering
- 🌗 Light / Dark theme
- ⚡ Optimistic UI with rollback
- 📱 Responsive interface
- 🗄️ MySQL + MongoDB persistence
- ☁️ Production deployment architecture

---

# 🎬 Product Flow

```mermaid
flowchart LR

    A[🔐 Login] --> B[📊 Dashboard]

    B --> C[📋 Kanban Board]

    C --> D[➕ Create Task]
    C --> E[🖱️ Drag & Drop]
    C --> F[✏️ Edit Task]

    F --> G[💾 Persist Changes]
    D --> G
    E --> G

    G --> H[(🗄️ MySQL)]

    F --> I[(🍃 MongoDB)]

    I --> J[🔔 Notifications]
    I --> K[💬 Comments]

    B --> L[📈 Analytics]

🏗️ System Architecture
                         🌍 INTERNET
                              │
                              ▼
                  ┌─────────────────────┐
                  │      VERCEL         │
                  │                     │
                  │ React + Vite        │
                  │ TypeScript          │
                  │ Tailwind CSS        │
                  └──────────┬──────────┘
                             │
                         HTTPS / API
                             │
                             ▼
                  ┌─────────────────────┐
                  │    SPRING BOOT      │
                  │       REST API      │
                  │                     │
                  │ JWT Security        │
                  │ Controllers         │
                  │ Services            │
                  │ Repositories        │
                  └─────────┬───────────┘
                            │
                 ┌──────────┴──────────┐
                 │                     │
                 ▼                     ▼
        ┌─────────────────┐   ┌─────────────────┐
        │      MySQL      │   │     MongoDB     │
        │                 │   │                 │
        │ Users           │   │ Comments        │
        │ Sprints         │   │ Notifications   │
        │ Tasks           │   │                 │
        └─────────────────┘   └─────────────────┘
Architecture Responsibilities
Layer	Responsibility
React	User interface and client interactions
TypeScript	Type safety
Vite	Development and production build
Spring Boot	REST API and business logic
Spring Security	Authentication and authorization
JWT	Access and refresh token authentication
MySQL	Users, sprints and tasks
MongoDB	Comments and notifications
Vercel	Production application hosting
🧰 Tech Stack
Frontend
Technology	Purpose
React 19	UI
TypeScript	Type safety
Vite	Build tooling
Tailwind CSS	Styling
React Router	Routing
TanStack Query	Server-state management
Zustand	Client-state management
dnd-kit	Drag & drop
Recharts	Analytics
Vitest	Testing
Backend
Technology	Purpose
Java 21	Backend language
Spring Boot 3.5	Application framework
Spring Web	REST APIs
Spring Security	Authentication
JWT	Access / refresh tokens
Spring Data JPA	MySQL persistence
Hibernate	ORM
Spring Data MongoDB	MongoDB persistence
Maven	Build system
Databases
MySQL

Stores structured application data:

users
sprints
tasks
MongoDB

Stores document-oriented data:

comments
notifications
🚀 Core Features
🔐 Authentication

TaskGenZ uses JWT-based authentication.

Login
  ↓
Access Token
  ↓
Authenticated Requests
  ↓
Access Token Expired
  ↓
Refresh Token
  ↓
New Access Token

Supported operations:

Login
Logout
Current user
Token refresh
Protected routes
JWT authentication filter
📋 Kanban Board

TaskGenZ provides a persistent Kanban workflow.

┌──────────┐   ┌─────────────┐   ┌────────┐   ┌──────┐
│ Backlog  │ → │ In Progress │ → │ Review │ → │ Done │
└──────────┘   └─────────────┘   └────────┘   └──────┘

Tasks can be:

Created
Edited
Moved
Reordered
Assigned
Deleted

Task status and ordering are persisted through the Spring Boot API.

🖱️ Drag & Drop

Task movement uses optimistic UI.

User drags task
      ↓
UI updates immediately ⚡
      ↓
Spring Boot API
      ↓
Database
      ↓
Success ───────────────→ Keep UI
      │
      └── Failure ─────→ Rollback

This provides a responsive interface while maintaining backend consistency.

🔔 Notification System

TaskGenZ includes persistent application notifications.

Notifications can be generated for:

🆕 Task creation
↔️ Task movement
↕️ Task reordering
📌 Status updates
🔥 Priority changes
📅 Due-date changes
👤 Assignment changes
✏️ Task updates
🗑️ Task deletion
💬 New comments

Notification actions:

Mark as read
Mark all as read
Delete
View notification list

Notifications are stored in MongoDB.

💬 Comments

Each task can contain persistent comments.

Task
 │
 ├── Comment 1
 ├── Comment 2
 ├── Comment 3
 └── ...

Users can:

Add comments
View comments
Delete comments
Refresh without losing data
📊 Analytics

The analytics dashboard provides project-level insights such as:

Total tasks
Completed tasks
In-progress tasks
High-priority tasks
Task distribution
Status breakdown
Productivity metrics

Analytics are calculated from persisted task data.

🔎 Search & Filters

The board supports task discovery through:

🔍 Search
📌 Status filter
🔥 Priority filter
👤 Assignee filter
Sprint selection
🌗 Theme System

TaskGenZ supports:

☀️ Light Mode
      ↕
🌙 Dark Mode

The theme is applied across:

Login
Dashboard
Board
Analytics
Modals
Drawers
Notifications
Forms
Cards
📱 Responsive UI

The interface is designed for:

🖥️ Desktop
💻 Laptop
📱 Mobile
📟 Tablet

The application adapts layouts, navigation and task-management components to different screen sizes.

📁 Project Structure
TaskGenZ/
│
├── backend/
│   ├── src/
│   │   └── main/
│   │       ├── java/com/sprintdesk/
│   │       │   ├── config/
│   │       │   ├── controller/
│   │       │   ├── dto/
│   │       │   ├── entity/
│   │       │   ├── repository/
│   │       │   ├── security/
│   │       │   └── service/
│   │       │
│   │       └── resources/
│   │           ├── application.yml
│   │           └── application-prod.yml
│   │
│   ├── Dockerfile
│   ├── Dockerfile.vercel
│   └── pom.xml
│
├── public/
│
├── src/
│   ├── api/
│   ├── assets/
│   ├── components/
│   │   ├── board/
│   │   ├── layout/
│   │   ├── notification/
│   │   ├── task/
│   │   └── ui/
│   │
│   ├── hooks/
│   ├── pages/
│   ├── routes/
│   ├── store/
│   ├── types/
│   └── __tests__/
│
├── .env.example
├── package.json
├── vite.config.ts
├── vercel.json
└── README.md

The Java package currently remains com.sprintdesk internally to preserve the existing backend architecture. The public product branding is TaskGenZ.

🔌 REST API

Base API:

/api
Health
GET /api/health
Authentication
POST /api/auth/login
POST /api/auth/refresh
GET  /api/auth/me
Tasks
GET    /api/tasks
POST   /api/tasks
PUT    /api/tasks/{id}
PATCH  /api/tasks/{id}/move
DELETE /api/tasks/{id}
Comments
GET    /api/comments
POST   /api/comments
DELETE /api/comments/{id}
Notifications
GET    /api/notifications
PATCH  /api/notifications/{id}/read
PATCH  /api/notifications/read-all
DELETE /api/notifications/{id}
Reference Data
GET /api/users
GET /api/sprints
🧪 Local Development
Requirements

Install:

Java 21
Maven 3.9+
Node.js 22+
npm
MySQL 8+/9+
MongoDB 8+
Git

You can use your existing local MySQL and MongoDB installations.

1️⃣ Start MySQL

If MySQL is already running, skip this step.

brew services start mysql

Create the database:

mysql -u YOUR_MYSQL_USER -p \
-e "CREATE DATABASE IF NOT EXISTS taskgenz;"
2️⃣ Start MongoDB

If MongoDB is already running, skip this step.

brew services start mongodb-community

Verify:

mongosh --eval 'db.runCommand({ ping: 1 })'
3️⃣ Start Spring Boot

Open a terminal:

cd /Users/ashutoshdubey/Downloads/Taskgenz/backend

Set local environment variables:

export MYSQL_URL='jdbc:mysql://127.0.0.1:3306/taskgenz?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC'

export MYSQL_USERNAME='YOUR_MYSQL_USER'

export MYSQL_PASSWORD='YOUR_MYSQL_PASSWORD'

export MONGODB_URI='mongodb://127.0.0.1:27017/taskgenz'

export JWT_SECRET='local-taskgenz-secret-change-this'

export CORS_ALLOWED_ORIGINS='http://localhost:5173'

export PORT=8080

Start Spring Boot:

mvn clean spring-boot:run

Verify:

curl -i http://localhost:8080/api/health

Expected response:

{
  "service": "taskgenz-api",
  "status": "UP"
}
4️⃣ Start Frontend

Open another terminal:

cd /Users/ashutoshdubey/Downloads/Taskgenz

Install dependencies:

npm install

Start development server:

npm run dev

Open:

http://localhost:5173

The Vite development proxy forwards:

/api/*
    ↓
http://localhost:8080
🔑 Development Login

The development seed supports:

admin / admin123
ashutosh / ashutosh123

If your existing database already contains users, use the credentials currently stored in your database.

Never publish real production credentials in this README.

🧪 Full Testing Checklist
Authentication
 Open /login
 Login
 Dashboard opens
 Logout
 Login again
Board
 Tasks load from MySQL
 Refresh preserves tasks
 Status changes persist
 Drag/drop works
 Reordering persists
Task Management
 Create task
 Edit task
 Delete task
 Change priority
 Change assignee
 Change due date
 Change status
Notifications
 Task created
 Task moved
 Task reordered
 Status updated
 Priority changed
 Due date changed
 Assignment changed
 Task updated
 Task deleted
 Comment created
Comments
 Add comment
 Refresh
 Comment remains
 Delete comment
 Refresh
Analytics
 Dashboard metrics load
 Charts load
 Task counts reflect database data
Theme
 Light mode
 Dark mode
 Refresh
 Both modes remain usable
🗄️ Verify MySQL

Connect:

mysql -u YOUR_MYSQL_USER -p taskgenz

Run:

SELECT
    id,
    title,
    status,
    priority,
    assignee_id,
    due_date,
    task_order
FROM tasks
ORDER BY status, task_order;

You should see task changes generated through the application.

🍃 Verify MongoDB

Open:

mongosh

Then:

use taskgenz

show collections

db.notifications
  .find()
  .sort({createdAt:-1})
  .limit(10)

db.comments
  .find()
  .sort({createdAt:-1})
  .limit(10)

You should see notifications and comments generated by the application.

🏗️ Production Build
Frontend

From the project root:

npm run lint
npm run test
npm run build
Backend
cd backend
mvn clean package

Both should complete successfully before production deployment.

☁️ Production Architecture

Localhost databases cannot be accessed by a public deployment.

Production architecture:

                    🌍 USERS
                       │
                       ▼
                ┌─────────────┐
                │   Vercel    │
                │ React/Vite  │
                └──────┬──────┘
                       │
                     HTTPS
                       │
                       ▼
                ┌─────────────┐
                │ Spring Boot │
                │ REST API    │
                └──────┬──────┘
                       │
              ┌────────┴────────┐
              │                 │
              ▼                 ▼
       ┌────────────┐    ┌────────────┐
       │   MySQL    │    │  MongoDB   │
       │            │    │            │
       │ Users      │    │ Comments   │
       │ Sprints    │    │ Notifications
       │ Tasks      │    │            │
       └────────────┘    └────────────┘

The application layer is stateless.

Database state remains outside the application container.

🔐 Production Environment Variables

Never commit production secrets.

Backend environment variables:

SPRING_PROFILES_ACTIVE=prod

MYSQL_URL=YOUR_MANAGED_MYSQL_JDBC_URL
MYSQL_USERNAME=YOUR_MANAGED_MYSQL_USER
MYSQL_PASSWORD=YOUR_MANAGED_MYSQL_PASSWORD

MONGODB_URI=YOUR_MONGODB_URI

JWT_SECRET=YOUR_LONG_RANDOM_SECRET

CORS_ALLOWED_ORIGINS=https://YOUR-PRODUCTION-DOMAIN

PORT=8080
Never commit
.env
MYSQL_PASSWORD
MONGODB_URI
JWT_SECRET
access tokens
refresh tokens

Only commit:

.env.example
🚀 Deployment Flow
       GitHub
          │
          ▼
     ┌─────────┐
     │ Vercel  │
     └────┬────┘
          │
          ▼
   React Frontend
          │
        HTTPS
          │
          ▼
   Spring Boot API
          │
       ┌──┴──┐
       ▼     ▼
     MySQL MongoDB
Deployment Order
Create production MySQL
Create production MongoDB
Configure backend environment variables
Deploy Spring Boot API
Verify /api/health
Configure frontend API URL
Deploy React application
Configure CORS
Test authentication
Test CRUD
Test drag/drop
Test notifications
Test comments
Test analytics
🔍 Production Verification

After deployment verify:

/
 /login
 /dashboard
 /board
 /analytics
 /api/health

Then test the complete CRUD workflow from another browser or device.

Because application data is stored in production databases, users are not dependent on your Mac or local localhost services.

🛡️ Security Principles

TaskGenZ follows these deployment rules:

🔐 Secrets
    ↓
Environment Variables

🗄️ Database Credentials
    ↓
Never commit to Git

🎫 JWT Secret
    ↓
Production environment only

🌍 API
    ↓
HTTPS

🛢️ Database
    ↓
Managed / secured connection
📌 Development Workflow
1. Develop locally
       ↓
2. Run tests
       ↓
3. Build frontend
       ↓
4. Build backend
       ↓
5. Review git diff
       ↓
6. Commit
       ↓
7. Push to GitHub
       ↓
8. Deploy
       ↓
9. Verify production

Useful commands:

git status

git diff

git add .

git commit -m "feat: update TaskGenZ"

git push origin main
📈 Project Goals

TaskGenZ is being developed as a practical Java Full Stack project demonstrating:

Frontend engineering
Backend engineering
REST API development
JWT security
SQL database design
NoSQL database usage
State management
API integration
Optimistic UI
Drag & drop interaction
Testing
Docker/container deployment
Cloud deployment
Production environment configuration
🗺️ Future Improvements

Potential future improvements include:

Team collaboration
Role-based access control
Advanced project management
File attachments
Activity timeline
Advanced reporting
Email notifications
Calendar integration
More granular permissions
Automated CI/CD pipelines
🧑‍💻 Author
<div align="center">
Ashutosh Dubey

Java Full Stack Developer • MCA Student • Software Developer

<br/> <a href="https://github.com/ashudubeyvns"> <img src="https://img.shields.io/badge/GitHub-ashudubeyvns-181717?style=for-the-badge&logo=github" /> </a> <a href="https://www.linkedin.com/in/ashutoshdubey0908/"> <img src="https://img.shields.io/badge/LinkedIn-Ashutosh%20Dubey-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" /> </a> </div>
<div align="center">
⚡ TaskGenZ

Plan. Build. Track. Deliver.

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&height=100&section=footer" width="100%"/> </div> ```