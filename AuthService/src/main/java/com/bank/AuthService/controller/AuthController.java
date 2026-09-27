package com.bank.AuthService.controller;

import com.bank.AuthService.dto.request.LoginRequest;
import com.bank.AuthService.dto.request.RegisterRequest;
import com.bank.AuthService.dto.response.AuthResponse;
import com.bank.AuthService.dto.response.UserResponse;
import com.bank.AuthService.service.interfaces.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @Valid @RequestBody RegisterRequest request) {
        System.out.println("Register API Hit");
        AuthResponse response = authService.register(request);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request) {

        return ResponseEntity.ok(authService.login(request));
    }
    @GetMapping("/me")
    public ResponseEntity<UserResponse> currentUser(
            Authentication authentication) {

        String username = authentication.getName();

        return ResponseEntity.ok(
                authService.getCurrentUser(username)
        );
    }
}
