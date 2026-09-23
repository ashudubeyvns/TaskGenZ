package com.sprintdesk.dto;

public final class AuthDtos {
    private AuthDtos() {}
    public record LoginRequest(String username, String password) {}
    public record UserResponse(Long id, String username, String email, String firstName, String lastName, String gender, String image) {}
    public record LoginResponse(Long id, String username, String email, String firstName, String lastName, String gender, String image, String accessToken, String refreshToken) {}
    public record RefreshRequest(String refreshToken) {}
    public record RefreshResponse(String accessToken, String refreshToken, UserResponse user) {}
}
