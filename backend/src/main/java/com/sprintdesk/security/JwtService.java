package com.sprintdesk.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class JwtService {
    private final SecretKey key;
    private final long accessExpiration;
    private final long refreshExpiration;

    public JwtService(@Value("${app.jwt.secret}") String secret,
                      @Value("${app.jwt.access-expiration-ms}") long accessExpiration,
                      @Value("${app.jwt.refresh-expiration-ms}") long refreshExpiration) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.accessExpiration = accessExpiration;
        this.refreshExpiration = refreshExpiration;
    }

    public String generateAccessToken(String username) { return generate(username, accessExpiration, "access"); }
    public String generateRefreshToken(String username) { return generate(username, refreshExpiration, "refresh"); }

    private String generate(String username, long expiration, String type) {
        Date now = new Date();
        return Jwts.builder().subject(username).claim("type", type)
                .issuedAt(now).expiration(new Date(now.getTime() + expiration))
                .signWith(key).compact();
    }

    public String extractUsername(String token) { return parse(token).getSubject(); }
    public boolean isAccessTokenValid(String token) {
        try { return "access".equals(parse(token).get("type", String.class)) && !isExpired(token); }
        catch (Exception e) { return false; }
    }
    public boolean isRefreshTokenValid(String token) {
        try { return "refresh".equals(parse(token).get("type", String.class)) && !isExpired(token); }
        catch (Exception e) { return false; }
    }
    private boolean isExpired(String token) { return parse(token).getExpiration().before(new Date()); }
    private Claims parse(String token) { return Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload(); }
}
