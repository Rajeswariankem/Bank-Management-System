package com.BankManagement.System.AccountService.Security;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class JwtUserPrincipal {

    private Long userId;
    private String username;
    private String role;
}
