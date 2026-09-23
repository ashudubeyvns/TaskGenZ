# SprintDesk Java Full-Stack Upgrade

This version preserves the existing SprintDesk frontend design and interaction model while replacing demo authentication/mock JSON data with a Java backend.

## Changed

- Added `backend/` Spring Boot REST API.
- Added JWT authentication with access + refresh tokens.
- Added MySQL/JPA persistence for users, sprints and tasks.
- Added MongoDB persistence for comments and notifications.
- Connected task CRUD and Kanban drag/drop to REST APIs.
- Connected task comments to MongoDB APIs.
- Connected notifications to MongoDB APIs with read/unread/delete actions and polling.
- Connected dashboard and analytics to database-backed tasks.
- Added local Docker Compose for MySQL + MongoDB.
- Added Vercel frontend environment configuration.
- Kept existing React/Tailwind visual design, colors, pages and component structure.

## Important deployment note

The React frontend can be deployed to Vercel. Spring Boot is not a normal Vercel frontend runtime, so the Java API must be reachable from Vercel through your own server/VPS or another Java-compatible backend host. MySQL and MongoDB must also be reachable by the Spring Boot server.

For local development, run MySQL and MongoDB on the same machine (or use the included Docker Compose), run Spring Boot on port 8080, then run the React app on port 5173.
