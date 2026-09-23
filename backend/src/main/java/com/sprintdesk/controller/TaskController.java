package com.sprintdesk.controller;

import com.sprintdesk.dto.TaskDtos;
import com.sprintdesk.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController @RequestMapping("/api/tasks")
public class TaskController {
    private final TaskService service;
    public TaskController(TaskService service){this.service=service;}
    @GetMapping public List<TaskDtos.TaskResponse> list(){return service.list();}
    @PostMapping @ResponseStatus(HttpStatus.CREATED) public TaskDtos.TaskResponse create(@Valid @RequestBody TaskDtos.CreateTaskRequest req){return service.create(req);}
    @PutMapping("/{id}") public TaskDtos.TaskResponse update(@PathVariable Long id,@Valid @RequestBody TaskDtos.UpdateTaskRequest req){return service.update(id,req);}
    @PatchMapping("/{id}/move") public TaskDtos.TaskResponse move(@PathVariable Long id,@Valid @RequestBody TaskDtos.MoveTaskRequest req){return service.move(id,req);}
    @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT) public void delete(@PathVariable Long id){service.delete(id);}
}
