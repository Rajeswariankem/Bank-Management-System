package com.BankManagement.System.NotificationService.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationResponse {

    private Long id;

    private Long userId;

    private String type;

    private String message;

    private boolean read;

    private LocalDateTime createdAt;
}