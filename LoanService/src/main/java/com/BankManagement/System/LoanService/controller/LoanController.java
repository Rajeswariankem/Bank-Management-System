package com.BankManagement.System.LoanService.controller;

import com.BankManagement.System.LoanService.dto.Request.ApplyLoanRequest;
import com.BankManagement.System.LoanService.dto.Response.LoanResponse;
import com.BankManagement.System.LoanService.dto.request.EmiPaymentRequest;
import com.BankManagement.System.LoanService.dto.request.RepaymentRequest;
import com.BankManagement.System.LoanService.dto.response.RepaymentResponse;
import com.BankManagement.System.LoanService.entity.LoanEmi;
import com.BankManagement.System.LoanService.service.interfaces.LoanEmiService;
import com.BankManagement.System.LoanService.service.interfaces.LoanRepaymentService;
import com.BankManagement.System.LoanService.service.interfaces.LoanService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/loans")
@RequiredArgsConstructor
public class LoanController {
    private final LoanRepaymentService loanRepaymentService;
    private final LoanService loanService;
    private final LoanEmiService loanEmiService;
    @PostMapping
    public ResponseEntity<LoanResponse> applyForLoan(
            @RequestHeader("X-User-Id") Long customerId,
            @RequestHeader("Authorization") String authorization,
            @Valid @RequestBody ApplyLoanRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(loanService.applyForLoan(
                        customerId,
                        authorization,
                        request
                ));
    }
    @GetMapping("/customer")
    public ResponseEntity<List<LoanResponse>> getCustomerLoans(
            @RequestHeader("X-User-Id") Long customerId) {

        return ResponseEntity.ok(
                loanService.getCustomerLoans(customerId)
        );
    }
    @GetMapping("/{loanNumber}")
    public ResponseEntity<LoanResponse> getLoan(
            @PathVariable String loanNumber) {

        return ResponseEntity.ok(
                loanService.getLoan(loanNumber)
        );
    }
    @GetMapping("/{loanNumber}/emis")
    public ResponseEntity<List<LoanEmi>> getEmiSchedule(
            @PathVariable String loanNumber) {

        return ResponseEntity.ok(
                loanEmiService.getEmiSchedule(loanNumber)
        );
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<List<LoanResponse>> getAllLoans() {

        return ResponseEntity.ok(
                loanService.getAllLoans()
        );
    }
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{loanNumber}/approve")
    public ResponseEntity<LoanResponse> approveLoan(
            @PathVariable String loanNumber) {

        return ResponseEntity.ok(
                loanService.approveLoan(loanNumber)
        );
    }
    @PostMapping("/{loanNumber}/emis/{emiNumber}/pay")
    public ResponseEntity<RepaymentResponse> payEmi(
            @PathVariable String loanNumber,
            @PathVariable String emiNumber,
            @RequestHeader("X-User-Id") Long customerId,
            @Valid @RequestBody EmiPaymentRequest request) {

        return ResponseEntity.ok(
                loanEmiService.payEmi(
                        loanNumber,
                        emiNumber,
                        customerId,
                        request
                )
        );
    }
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{loanNumber}/reject")
    public ResponseEntity<LoanResponse> rejectLoan(
            @PathVariable String loanNumber) {

        return ResponseEntity.ok(
                loanService.rejectLoan(loanNumber)
        );
    }
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{loanNumber}/disburse")
    public ResponseEntity<LoanResponse> disburseLoan(
            @PathVariable String loanNumber,
            @RequestHeader("Authorization") String authorization) {

        return ResponseEntity.ok(
                loanService.disburseLoan(
                        loanNumber,
                        authorization
                )
        );
    }

    @PostMapping("/{loanNumber}/repay")
    public ResponseEntity<RepaymentResponse> makeRepayment(
            @PathVariable String loanNumber,
            @RequestHeader("X-User-Id") Long customerId,
            @Valid @RequestBody RepaymentRequest request) {

        return ResponseEntity.ok(
                loanRepaymentService.makeRepayment(
                        loanNumber,
                        customerId,
                        request
                )
        );
    }
    @GetMapping("/{loanNumber}/repayments")
    public ResponseEntity<List<RepaymentResponse>> getRepayments(
            @PathVariable String loanNumber) {

        return ResponseEntity.ok(
                loanRepaymentService.getRepayments(loanNumber)
        );
    }

}