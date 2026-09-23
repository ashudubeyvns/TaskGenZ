package com.sprintdesk.controller;

import com.sprintdesk.dto.CommonDtos;
import com.sprintdesk.entity.CommentDocument;
import com.sprintdesk.repository.CommentRepository;
import com.sprintdesk.service.UserService;
import com.sprintdesk.service.NotificationService;
import com.sprintdesk.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.time.Instant;
import java.util.List;

@RestController @RequestMapping("/api/comments")
public class CommentController {
    private final CommentRepository comments;
    private final UserService users;
    private final NotificationService notifications;
    private final TaskService tasks;

    public CommentController(
            CommentRepository comments,
            UserService users,
            NotificationService notifications,
            TaskService tasks
    ) {
        this.comments = comments;
        this.users = users;
        this.notifications = notifications;
        this.tasks = tasks;
    }
    @GetMapping public List<CommonDtos.CommentResponse> list(@RequestParam(required=false) Long taskId){var docs=taskId==null?comments.findAll():comments.findByTaskIdOrderByCreatedAtAsc(taskId);return docs.stream().map(this::dto).toList();}
    @PostMapping @ResponseStatus(HttpStatus.CREATED) public CommonDtos.CommentResponse create(@RequestParam Long taskId,@Valid @RequestBody CommonDtos.CommentRequest req,Principal principal){if(req.text()==null||req.text().isBlank())throw new IllegalArgumentException("Comment cannot be empty"); CommentDocument d=new CommentDocument();d.setId(System.currentTimeMillis()*1000+(long)(Math.random()*1000));d.setTaskId(taskId);d.setAuthorId(users.current(principal.getName()).getId());d.setText(req.text().trim());d.setCreatedAt(Instant.now());
        CommentDocument saved = comments.save(d);
        var task = tasks.require(taskId);
        notifications.create(
                task.getAssignee().getId(),
                "task_updated",
                "New comment",
                "A new comment was added to \"" + task.getTitle() + "\"."
        );
        return dto(saved);}
    @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT) public void delete(@PathVariable Long id,Principal principal){Long current=users.current(principal.getName()).getId(); comments.findById(id).filter(c->c.getAuthorId().equals(current)).ifPresentOrElse(comments::delete,()->{throw new IllegalArgumentException("Comment not found or not owned by current user");});}
    private CommonDtos.CommentResponse dto(CommentDocument c){return new CommonDtos.CommentResponse(c.getId(),c.getTaskId(),c.getAuthorId(),c.getText(),c.getCreatedAt());}
}
