package com.BankManagement.System.LoanService.client;

import com.BankManagement.System.LoanService.dto.request.NotificationRequest;
import com.BankManagement.System.LoanService.dto.response.NotificationResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(
        name = "notification-service",
        url = "${notification.service.url}"
)
public interface NotificationClient {

    @PostMapping("/notifications")
    NotificationResponse createNotification(
            @RequestBody NotificationRequest request
    );
}