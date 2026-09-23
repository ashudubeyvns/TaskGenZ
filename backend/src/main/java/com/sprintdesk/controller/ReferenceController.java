package com.sprintdesk.controller;

import com.sprintdesk.dto.CommonDtos;
import com.sprintdesk.entity.User;
import com.sprintdesk.repository.SprintRepository;
import com.sprintdesk.repository.UserRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController @RequestMapping("/api")
public class ReferenceController {
    private final UserRepository users; private final SprintRepository sprints;
    public ReferenceController(UserRepository users,SprintRepository sprints){this.users=users;this.sprints=sprints;}
    @GetMapping("/users") public List<CommonDtos.UserResponse> users(){return users.findAll().stream().map(u->new CommonDtos.UserResponse(u.getId(),u.getName(),u.getEmail(),u.getAvatar())).toList();}
    @GetMapping("/sprints") public List<CommonDtos.SprintResponse> sprints(){return sprints.findAll().stream().map(s->new CommonDtos.SprintResponse(s.getId(),s.getName(),s.getStartDate(),s.getEndDate())).toList();}
}
