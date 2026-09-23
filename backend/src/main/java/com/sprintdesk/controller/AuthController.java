package com.sprintdesk.controller;

import com.sprintdesk.dto.AuthDtos;
import com.sprintdesk.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;

@RestController @RequestMapping("/api/auth")
public class AuthController {
    private final AuthService service;
    public AuthController(AuthService service){this.service=service;}
    @PostMapping("/login") public AuthDtos.LoginResponse login(@RequestBody AuthDtos.LoginRequest req){return service.login(req);}
    @PostMapping("/refresh") public AuthDtos.RefreshResponse refresh(@RequestBody AuthDtos.RefreshRequest req){return service.refresh(req);}
    @GetMapping("/me") public AuthDtos.UserResponse me(Principal principal){return service.current(principal.getName());}
}
