package com.BankManagement.System.NotificationService.service.Impl;

import com.BankManagement.System.NotificationService.dto.NotificationRequest;
import com.BankManagement.System.NotificationService.dto.NotificationResponse;
import com.BankManagement.System.NotificationService.entity.Notification;
import com.BankManagement.System.NotificationService.repository.NotificationRepository;
import com.BankManagement.System.NotificationService.service.Interface.NotificationService;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;

    @Override
    public NotificationResponse createNotification(NotificationRequest request) {

        Notification notification = Notification.builder()
                .userId(request.getUserId())
                .message(request.getMessage())
                .type(request.getType())
                .read(false)
                .build();

        Notification saved = notificationRepository.save(notification);

        return mapToResponse(saved);
    }

    @Override
    public List<NotificationResponse> getNotifications(
            String userId) {

        return notificationRepository
                .findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private NotificationResponse mapToResponse(
            Notification notification) {

        return NotificationResponse.builder()
                .id(notification.getId())
                .userId(notification.getUserId())
                .type(notification.getType())
                .message(notification.getMessage())
                .read(notification.isRead())
                .createdAt(notification.getCreatedAt())
                .build();
    }
}