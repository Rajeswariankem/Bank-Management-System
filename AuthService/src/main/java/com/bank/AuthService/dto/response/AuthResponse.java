package com.bank.AuthService.dto.response;

import com.bank.AuthService.enums.Role;
import lombok.*;

@Getter
@Builder
@AllArgsConstructor
public class AuthResponse {

    private String token;
    private String username;
    private Role role;
    private String message;
}
