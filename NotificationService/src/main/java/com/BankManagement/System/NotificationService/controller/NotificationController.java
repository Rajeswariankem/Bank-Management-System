package com.BankManagement.System.NotificationService.controller;

import com.BankManagement.System.NotificationService.dto.NotificationRequest;
import com.BankManagement.System.NotificationService.dto.NotificationResponse;
import com.BankManagement.System.NotificationService.service.Interface.NotificationService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @PostMapping
    public ResponseEntity<NotificationResponse> createNotification(
            @Valid @RequestBody NotificationRequest request) {

        NotificationResponse response =
                notificationService.createNotification(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<NotificationResponse>> getNotifications(
            @PathVariable String userId) {

        return ResponseEntity.ok(
                notificationService.getNotifications(userId)
        );
    }
}