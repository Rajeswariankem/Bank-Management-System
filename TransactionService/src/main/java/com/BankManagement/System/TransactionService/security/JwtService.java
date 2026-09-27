package com.BankManagement.System.TransactionService.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secret;

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    public Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public String extractUsername(String token) {
        return extractAllClaims(token).getSubject();
    }

    public String extractRole(String token) {
        return extractAllClaims(token).get("role", String.class);
    }

    public Long extractUserId(String token) {
        Object userId =
                extractAllClaims(token).get("userId");

        if (userId == null) {
            return null;
        }

        return ((Number) userId).longValue();
    }

    public boolean isTokenValid(String token) {

        try {

            Claims claims = extractAllClaims(token);

            Date expiration = claims.getExpiration();

            return expiration != null &&
                    expiration.after(new Date());

        } catch (Exception exception) {
            return false;
        }
    }
}