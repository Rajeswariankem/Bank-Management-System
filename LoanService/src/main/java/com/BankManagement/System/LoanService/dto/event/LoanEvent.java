package com.BankManagement.System.LoanService.dto.event;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LoanEvent {

    private String eventType;

    private String loanNumber;

    private Long customerId;

    private String accountNumber;

    private String message;
}