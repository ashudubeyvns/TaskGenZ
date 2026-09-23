package com.sprintdesk.service;

import com.sprintdesk.dto.AuthDtos;
import com.sprintdesk.entity.User;
import com.sprintdesk.repository.UserRepository;
import com.sprintdesk.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final UserRepository users; private final PasswordEncoder encoder; private final JwtService jwt;
    public AuthService(UserRepository users,PasswordEncoder encoder,JwtService jwt){this.users=users;this.encoder=encoder;this.jwt=jwt;}
    public AuthDtos.LoginResponse login(AuthDtos.LoginRequest req){
        User user=users.findByUsername(req.username()).orElseGet(()->users.findByEmail(req.username()).orElse(null));
        if(user==null || !user.isActive() || !encoder.matches(req.password(),user.getPasswordHash())) throw new IllegalArgumentException("Invalid username or password");
        return new AuthDtos.LoginResponse(user.getId(),user.getUsername(),user.getEmail(),first(user.getName()),last(user.getName()),"",user.getAvatar(),jwt.generateAccessToken(user.getUsername()),jwt.generateRefreshToken(user.getUsername()));
    }
    public AuthDtos.RefreshResponse refresh(AuthDtos.RefreshRequest req){
        if(req.refreshToken()==null || !jwt.isRefreshTokenValid(req.refreshToken())) throw new IllegalArgumentException("Invalid or expired refresh token");
        User user=users.findByUsername(jwt.extractUsername(req.refreshToken())).orElseThrow(()->new IllegalArgumentException("User not found"));
        return new AuthDtos.RefreshResponse(jwt.generateAccessToken(user.getUsername()),jwt.generateRefreshToken(user.getUsername()),toUser(user));
    }
    public AuthDtos.UserResponse current(String username){return toUser(users.findByUsername(username).orElseThrow());}
    private AuthDtos.UserResponse toUser(User u){return new AuthDtos.UserResponse(u.getId(),u.getUsername(),u.getEmail(),first(u.getName()),last(u.getName()),"",u.getAvatar());}
    private String first(String n){return n==null?"":n.trim().split(" ")[0];}
    private String last(String n){String[] p=n==null?new String[0]:n.trim().split(" ");return p.length<2?"":p[p.length-1];}
}
