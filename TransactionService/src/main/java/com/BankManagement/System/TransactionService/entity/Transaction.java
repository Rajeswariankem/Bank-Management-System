package com.BankManagement.System.TransactionService.entity;

import com.BankManagement.System.TransactionService.enums.TransactionStatus;
import com.BankManagement.System.TransactionService.enums.TransactionType;
import jakarta.persistence.*;
import jakarta.transaction.Transactional;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity

public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String transactionId;
    @Column
    private String sourceAccountNumber;
    @Column
    private String destinationAccountNumber;
    @Builder.Default
    @Column(nullable = false)
    private BigDecimal amount=BigDecimal.ZERO;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionType transactionType;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionStatus transactionStatus;
    @Column
    private String description;
    @Column
    private LocalDateTime createdAt;
    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();

    }
}
