# TaskForge QA Checklist

## Local smoke test
- [ ] MySQL is running
- [ ] MongoDB is running
- [ ] Spring Boot starts on 8080
- [ ] `GET /api/health` returns 200
- [ ] Vite starts on 5173
- [ ] Login works
- [ ] Dashboard loads
- [ ] Board loads
- [ ] Analytics loads

## Task persistence
- [ ] Create task
- [ ] Refresh: task still exists
- [ ] Edit title/description
- [ ] Edit status
- [ ] Edit priority
- [ ] Edit assignee
- [ ] Edit due date
- [ ] Refresh: all edits remain
- [ ] Delete task
- [ ] Refresh: deleted task remains deleted

## Drag and reorder
- [ ] Backlog → In Progress
- [ ] In Progress → Review
- [ ] Review → Done
- [ ] Done → Review
- [ ] Reorder inside same column
- [ ] Refresh: order remains

## MongoDB features
- [ ] Add comment
- [ ] Refresh: comment remains
- [ ] Delete comment
- [ ] Task created notification
- [ ] Task moved notification
- [ ] Task reordered notification
- [ ] Priority changed notification
- [ ] Due date changed notification
- [ ] Assignment notification
- [ ] Task updated notification
- [ ] Task deleted notification
- [ ] Comment notification
- [ ] Mark notification as read
- [ ] Mark all as read
- [ ] Delete notification

## Production
- [ ] `npm run lint`
- [ ] `npm run test`
- [ ] `npm run build`
- [ ] `mvn clean package`
- [ ] GitHub push contains no secrets
- [ ] Vercel frontend opens
- [ ] Vercel `/api/health` returns 200
- [ ] Production MySQL persists tasks
- [ ] Production MongoDB persists comments/notifications
- [ ] Public URL works from another network/device
