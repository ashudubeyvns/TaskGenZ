package com.sprintdesk.dto;

import com.sprintdesk.entity.Task;
import jakarta.validation.constraints.*;
import java.time.Instant;
import java.time.LocalDate;

public final class TaskDtos {
    private TaskDtos() {}
    public record TaskResponse(Long id, String title, String description, String status, String priority, Long assigneeId, LocalDate dueDate, Long sprintId, Integer order, Instant createdAt, Instant completedAt, Instant updatedAt) {}
    public record CreateTaskRequest(
        @NotBlank String title,
        String description,
        @NotNull Task.Priority priority,
        @NotNull Long assigneeId,
        @NotNull @FutureOrPresent LocalDate dueDate,
        @NotNull Long sprintId
) {}
    public record UpdateTaskRequest(@NotBlank String title, String description, @NotNull Task.Status status, @NotNull Task.Priority priority, @NotNull Long assigneeId, @NotNull @FutureOrPresent LocalDate dueDate) {}
    public record MoveTaskRequest(@NotNull Task.Status status, @NotNull @Min(1) Integer order) {}
}
