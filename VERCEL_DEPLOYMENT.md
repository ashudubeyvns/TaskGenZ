# TaskForge — Vercel Deployment

## Architecture

```text
Browser
  ↓
Vercel Services
  ├── React/Vite frontend
  └── Spring Boot HTTP container
          ↓
     Managed MySQL
          +
     Managed MongoDB
```

Vercel's current Services/container model supports deploying multiple HTTP services in one project. The application containers are stateless, so MySQL and MongoDB remain external persistent services.

## 1. Create production databases

Create:

- Managed MySQL database/schema: `sprintdesk`
- Managed MongoDB database: `sprintdesk`

Do not use your Mac's `localhost` database URLs in production.

## 2. Push to GitHub

```bash
git add .
git commit -m "feat: production TaskForge full stack"
git push
```

Never commit `.env`, database passwords, MongoDB connection strings, or JWT secrets.

## 3. Import into Vercel

Import the GitHub repository.

The repository already contains:

```text
vercel.json
backend/Dockerfile.vercel
```

The Vercel configuration maps:

```text
/api/* → Spring Boot service
/*     → React frontend
```

## 4. Environment variables

In Vercel:

**Project → Settings → Environment Variables → Production**

Add:

```text
SPRING_PROFILES_ACTIVE=default
MYSQL_URL=YOUR_MANAGED_MYSQL_JDBC_URL
MYSQL_USERNAME=YOUR_MYSQL_USERNAME
MYSQL_PASSWORD=YOUR_MYSQL_PASSWORD
MONGODB_URI=YOUR_MONGODB_URI
JWT_SECRET=YOUR_LONG_RANDOM_SECRET
CORS_ALLOWED_ORIGINS=https://YOUR-PROJECT.vercel.app
PORT=8080
```

Use a strong randomly generated JWT secret.

Do not expose database credentials through variables prefixed with `VITE_`.

## 5. Deploy

Trigger a deployment from the Vercel dashboard or push a new commit to the connected GitHub branch.

## 6. Verify

Open:

```text
https://YOUR-PROJECT.vercel.app/
https://YOUR-PROJECT.vercel.app/login
https://YOUR-PROJECT.vercel.app/api/health
```

Then test:

- Login
- Dashboard
- Board
- Drag/drop
- Reorder
- Task create
- Task edit
- Task delete
- Comments
- Notifications
- Analytics
- Theme toggle

## 7. Database verification

After creating/editing tasks through the public URL:

MySQL:

```sql
SELECT id, title, status, priority, due_date, task_order
FROM tasks
ORDER BY id DESC;
```

MongoDB:

```javascript
use sprintdesk
db.notifications.find().sort({createdAt:-1}).limit(20)
db.comments.find().sort({createdAt:-1}).limit(20)
```

## 8. Custom domain

After the deployment is stable, add your custom domain in Vercel:

**Project → Settings → Domains**

The same domain will serve the frontend and `/api/*` routes.

## 9. Production rule

Do not store persistent files inside the Vercel container. Database state belongs in managed MySQL/MongoDB.

For current Vercel container/service behavior, see the official Vercel documentation linked from the project deployment notes.
