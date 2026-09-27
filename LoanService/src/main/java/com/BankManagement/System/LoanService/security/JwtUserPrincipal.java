package com.BankManagement.System.LoanService.security;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class JwtUserPrincipal {

    private Long userId;
    private String username;
    private String role;
}