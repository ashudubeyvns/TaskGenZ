package com.sprintdesk.dto;

import java.time.Instant;
import java.time.LocalDate;

public final class CommonDtos {
    private CommonDtos() {}
    public record UserResponse(Long id, String name, String email, String avatar) {}
    public record SprintResponse(Long id, String name, LocalDate startDate, LocalDate endDate) {}
    public record CommentResponse(Long id, Long taskId, Long authorId, String text, Instant createdAt) {}
    public record NotificationResponse(Long id, String type, String title, String message, Instant createdAt, boolean read) {}
    public record CommentRequest(String text) {}
}
