package com.BankManagement.System.AccountService.client;

import com.BankManagement.System.AccountService.dto.Response.UserResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient(
        name = "auth-service",
        url = "http://localhost:8081"
)
public interface AuthServiceClient {

    @GetMapping("/auth/me")
    UserResponse getCurrentUser(
            @RequestHeader("Authorization") String token
    );
}
