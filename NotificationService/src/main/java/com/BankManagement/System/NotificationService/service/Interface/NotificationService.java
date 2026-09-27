package com.BankManagement.System.NotificationService.service.Interface;

import com.BankManagement.System.NotificationService.dto.NotificationRequest;
import com.BankManagement.System.NotificationService.dto.NotificationResponse;

import java.util.List;

public interface NotificationService {

    NotificationResponse createNotification(
            NotificationRequest request
    );

    List<NotificationResponse> getNotifications(
            String userId
    );
}