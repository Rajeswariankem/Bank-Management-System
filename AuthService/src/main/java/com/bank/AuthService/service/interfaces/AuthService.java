package com.bank.AuthService.service.interfaces;

import com.bank.AuthService.dto.request.LoginRequest;
import com.bank.AuthService.dto.request.RegisterRequest;
import com.bank.AuthService.dto.response.AuthResponse;
import com.bank.AuthService.dto.response.UserResponse;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);
    UserResponse getCurrentUser(String username);

}
