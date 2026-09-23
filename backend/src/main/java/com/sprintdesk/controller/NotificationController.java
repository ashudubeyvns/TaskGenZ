package com.sprintdesk.controller;

import com.sprintdesk.dto.CommonDtos;
import com.sprintdesk.service.NotificationService;
import com.sprintdesk.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.List;

@RestController @RequestMapping("/api/notifications")
public class NotificationController {
    private final NotificationService service; private final UserService users;
    public NotificationController(NotificationService service,UserService users){this.service=service;this.users=users;}
    @GetMapping public List<CommonDtos.NotificationResponse> list(Principal p){return service.list(users.current(p.getName()).getId());}
    @PatchMapping("/{id}/read") public void read(@PathVariable Long id,Principal p){service.markRead(users.current(p.getName()).getId(),id);}
    @PatchMapping("/read-all") public void readAll(Principal p){service.markAllRead(users.current(p.getName()).getId());}
    @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT) public void remove(@PathVariable Long id,Principal p){service.remove(users.current(p.getName()).getId(),id);}
}
