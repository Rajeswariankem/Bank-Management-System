package com.BankManagement.System.LoanService.entity;

import com.BankManagement.System.LoanService.enums.RepaymentStatus;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoanRepayment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String repaymentNumber;

    @Column(nullable = false)
    private String loanNumber;

    @Column(nullable = false)
    private Long customerId;

    @Column(nullable = false)
    private BigDecimal amount;

    @Column(nullable = false)
    private BigDecimal remainingAmount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RepaymentStatus status;

    @Column(nullable = false)
    private LocalDateTime paymentDate;

    @PrePersist
    public void onCreate() {
        paymentDate = LocalDateTime.now();
    }
}