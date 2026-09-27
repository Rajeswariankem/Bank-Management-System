package com.BankManagement.System.LoanService.entity;

import com.BankManagement.System.LoanService.enums.EmiStatus;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "loan_emi")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoanEmi {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String emiNumber;
    @Column
    private LocalDateTime paidDate;
    @Column(nullable = false)
    private String loanNumber;

    @Column(nullable = false)
    private Long customerId;

    @Column(nullable = false)
    private Integer installmentNumber;

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal amount;

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal remainingAmount;

    @Column(nullable = false)
    private LocalDate dueDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EmiStatus status;

    @PrePersist
    public void onCreate() {
        if (status == null) {
            status = EmiStatus.PENDING;
        }
    }
}