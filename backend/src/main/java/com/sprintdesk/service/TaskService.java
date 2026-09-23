package com.sprintdesk.service;

import com.sprintdesk.dto.TaskDtos;
import com.sprintdesk.entity.Sprint;
import com.sprintdesk.entity.Task;
import com.sprintdesk.entity.User;
import com.sprintdesk.repository.SprintRepository;
import com.sprintdesk.repository.TaskRepository;
import com.sprintdesk.repository.CommentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
public class TaskService {
    private final TaskRepository tasks; private final CommentRepository comments; private final UserService users; private final SprintRepository sprints; private final NotificationService notifications;
    public TaskService(TaskRepository tasks,CommentRepository comments,UserService users,SprintRepository sprints,NotificationService notifications){this.tasks=tasks;this.comments=comments;this.users=users;this.sprints=sprints;this.notifications=notifications;}
    public List<TaskDtos.TaskResponse> list(){return tasks.findAllByOrderByStatusAscTaskOrderAsc().stream().map(this::dto).toList();}
    @Transactional public TaskDtos.TaskResponse create(TaskDtos.CreateTaskRequest req){
        User assignee = users.require(req.assigneeId());

        Sprint sprint = sprints.findById(req.sprintId())
                .orElseThrow(() -> new IllegalArgumentException(
                        "Sprint not found: " + req.sprintId()
                ));
        Task t=new Task(); 
        Instant now=Instant.now();
        t.setTitle(req.title().trim()); 
        t.setDescription(
            req.description()==null||req.description().isBlank()?"No description provided.":req.description().trim()); t.setStatus(Task.Status.backlog); t.setPriority(req.priority()); t.setAssignee(assignee); t.setDueDate(req.dueDate()); t.setSprint(sprint); t.setTaskOrder((int)tasks.countByStatus(Task.Status.backlog)+1); t.setCreatedAt(now); t.setUpdatedAt(now); t.setCompletedAt(null);
        Task saved=tasks.save(t); notifications.create(assignee.getId(),"task_created","Task created","\""+saved.getTitle()+"\" was added to the sprint backlog."); return dto(saved);
    }
    @Transactional
    public TaskDtos.TaskResponse update(Long id, TaskDtos.UpdateTaskRequest req) {
        Task t = require(id);

        Task.Status oldStatus = t.getStatus();
        Task.Priority oldPriority = t.getPriority();
        Long oldAssignee = t.getAssignee().getId();
        var oldDueDate = t.getDueDate();

        t.setTitle(req.title().trim());
        t.setDescription(req.description() == null ? "" : req.description().trim());
        t.setStatus(req.status());
        t.setPriority(req.priority());
        t.setAssignee(users.require(req.assigneeId()));
        t.setDueDate(req.dueDate());
        t.setUpdatedAt(Instant.now());

        if (req.status() == Task.Status.done && t.getCompletedAt() == null) {
            t.setCompletedAt(Instant.now());
        }
        if (req.status() != Task.Status.done) {
            t.setCompletedAt(null);
        }

        Task saved = tasks.save(t);

        Long recipient = saved.getAssignee().getId();

        if (oldStatus != saved.getStatus()) {
            notifications.create(
                    recipient,
                    "task_moved",
                    "Task status updated",
                    "\""+saved.getTitle()+"\" moved from " + format(oldStatus) + " to " + format(saved.getStatus()) + "."
            );
        }

        if (!oldPriority.equals(saved.getPriority())) {
            notifications.create(
                    recipient,
                    "task_updated",
                    "Priority changed",
                    "\""+saved.getTitle()+"\" priority changed from " + format(oldPriority) + " to " + format(saved.getPriority()) + "."
            );
        }

        if (!oldDueDate.equals(saved.getDueDate())) {
            notifications.create(
                    recipient,
                    "task_updated",
                    "Due date changed",
                    "\""+saved.getTitle()+"\" due date changed to " + saved.getDueDate() + "."
            );
        }

        if (!oldAssignee.equals(saved.getAssignee().getId())) {
            notifications.create(
                    saved.getAssignee().getId(),
                    "task_assigned",
                    "Task assigned",
                    "\""+saved.getTitle()+"\" was assigned to " + saved.getAssignee().getName() + "."
            );
            notifications.create(
                    oldAssignee,
                    "task_updated",
                    "Task reassigned",
                    "\""+saved.getTitle()+"\" was reassigned to " + saved.getAssignee().getName() + "."
            );
        }

        if (oldStatus == saved.getStatus()
                && oldPriority.equals(saved.getPriority())
                && oldDueDate.equals(saved.getDueDate())
                && oldAssignee.equals(saved.getAssignee().getId())) {
            notifications.create(
                    recipient,
                    "task_updated",
                    "Task updated",
                    "\""+saved.getTitle()+"\" was updated."
            );
        }

        return dto(saved);
    }

    @Transactional
    public TaskDtos.TaskResponse move(Long id, TaskDtos.MoveTaskRequest req) {
        Task moving = require(id);
        Task.Status sourceStatus = moving.getStatus();
        Task.Status targetStatus = req.status();

        if (sourceStatus == targetStatus) {
            List<Task> ordered = tasks.findAll().stream()
                    .filter(t -> t.getStatus() == targetStatus)
                    .sorted(java.util.Comparator.comparing(Task::getTaskOrder))
                    .toList();

            java.util.List<Task> reordered = new java.util.ArrayList<>(ordered);
            reordered.removeIf(t -> t.getId().equals(id));
            int insertAt = Math.max(0, Math.min(req.order() - 1, reordered.size()));
            reordered.add(insertAt, moving);

            for (int i = 0; i < reordered.size(); i++) {
                reordered.get(i).setTaskOrder(i + 1);
                reordered.get(i).setUpdatedAt(Instant.now());
            }

            moving.setCompletedAt(targetStatus == Task.Status.done
                    ? (moving.getCompletedAt() == null ? Instant.now() : moving.getCompletedAt())
                    : null);

            tasks.saveAll(reordered);

            notifications.create(
                    moving.getAssignee().getId(),
                    "task_moved",
                    "Task reordered",
                    "\""+moving.getTitle()+"\" was reordered in " + format(targetStatus) + "."
            );

            return dto(moving);
        }

        List<Task> sourceTasks = tasks.findAll().stream()
                .filter(t -> t.getStatus() == sourceStatus && !t.getId().equals(id))
                .sorted(java.util.Comparator.comparing(Task::getTaskOrder))
                .toList();

        List<Task> targetTasks = tasks.findAll().stream()
                .filter(t -> t.getStatus() == targetStatus && !t.getId().equals(id))
                .sorted(java.util.Comparator.comparing(Task::getTaskOrder))
                .toList();

        moving.setStatus(targetStatus);
        moving.setCompletedAt(targetStatus == Task.Status.done ? Instant.now() : null);

        int insertAt = Math.max(0, Math.min(req.order() - 1, targetTasks.size()));
        targetTasks = new java.util.ArrayList<>(targetTasks);
        targetTasks.add(insertAt, moving);

        Instant now = Instant.now();
        for (int i = 0; i < sourceTasks.size(); i++) {
            sourceTasks.get(i).setTaskOrder(i + 1);
            sourceTasks.get(i).setUpdatedAt(now);
        }
        for (int i = 0; i < targetTasks.size(); i++) {
            targetTasks.get(i).setTaskOrder(i + 1);
            targetTasks.get(i).setUpdatedAt(now);
        }

        tasks.saveAll(sourceTasks);
        tasks.saveAll(targetTasks);

        notifications.create(
                moving.getAssignee().getId(),
                "task_moved",
                "Task moved",
                "\""+moving.getTitle()+"\" moved from " + format(sourceStatus) + " to " + format(targetStatus) + "."
        );

        return dto(moving);
    }

    @Transactional
    public void delete(Long id) {
        Task t = require(id);
        Long assigneeId = t.getAssignee().getId();
        String title = t.getTitle();

        comments.deleteByTaskId(id);
        tasks.delete(t);

        notifications.create(
                assigneeId,
                "task_deleted",
                "Task deleted",
                "\""+title+"\" was deleted from the sprint."
        );
    }

    public Task require(Long id){return tasks.findById(id).orElseThrow(()->new IllegalArgumentException("Task not found: "+id));}
    public TaskDtos.TaskResponse dto(Task t){return new TaskDtos.TaskResponse(t.getId(),t.getTitle(),t.getDescription(),t.getStatus()==Task.Status.in_progress?"in-progress":t.getStatus().name(),t.getPriority().name(),t.getAssignee().getId(),t.getDueDate(),t.getSprint().getId(),t.getTaskOrder(),t.getCreatedAt(),t.getCompletedAt(),t.getUpdatedAt());}
    private String format(Task.Status s) {
        return switch (s) {
            case in_progress -> "In Progress";
            case backlog -> "Backlog";
            case review -> "Review";
            case done -> "Done";
        };
    }

    private String format(Task.Priority p) {
        return switch (p) {
            case low -> "Low";
            case medium -> "Medium";
            case high -> "High";
        };
    }
}
