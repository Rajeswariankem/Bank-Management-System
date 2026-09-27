package com.BankManagement.System.LoanService.service.impl;

import com.BankManagement.System.LoanService.client.TransactionServiceClient;
import com.BankManagement.System.LoanService.dto.request.CreateTransactionRequest;
import com.BankManagement.System.LoanService.dto.request.RepaymentRequest;
import com.BankManagement.System.LoanService.dto.response.RepaymentResponse;
import com.BankManagement.System.LoanService.entity.Loan;
import com.BankManagement.System.LoanService.entity.LoanRepayment;
import com.BankManagement.System.LoanService.enums.LoanStatus;
import com.BankManagement.System.LoanService.enums.RepaymentStatus;
import com.BankManagement.System.LoanService.enums.TransactionType;
import com.BankManagement.System.LoanService.repository.LoanRepaymentRepository;
import com.BankManagement.System.LoanService.repository.LoanRepository;
import com.BankManagement.System.LoanService.service.interfaces.LoanRepaymentService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class LoanRepaymentServiceImpl implements LoanRepaymentService {

    private final LoanRepository loanRepository;
    private final LoanRepaymentRepository repaymentRepository;
    private final TransactionServiceClient transactionServiceClient;
    @Override
    @Transactional
    public RepaymentResponse makeRepayment(
            String loanNumber,
            Long customerId,
            RepaymentRequest request) {

        Loan loan = loanRepository.findByLoanNumber(loanNumber)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Loan not found: " + loanNumber));

        if (!loan.getCustomerId().equals(customerId)) {
            throw new RuntimeException(
                    "You cannot repay another customer's loan.");
        }

        if (loan.getStatus() != LoanStatus.APPROVED) {
            throw new RuntimeException(
                    "Only approved loans can be repaid.");
        }

        BigDecimal amount = request.getAmount();

        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException(
                    "Repayment amount must be greater than zero.");
        }

        BigDecimal remainingAmount = loan.getRemainingAmount();

        if (amount.compareTo(remainingAmount) > 0) {
            throw new RuntimeException(
                    "Repayment amount cannot exceed remaining loan amount.");
        }

        BigDecimal newRemainingAmount =
                remainingAmount.subtract(amount);

        loan.setRemainingAmount(newRemainingAmount);

        if (newRemainingAmount.compareTo(BigDecimal.ZERO) == 0) {
            loan.setStatus(LoanStatus.COMPLETED);
        }

        loanRepository.save(loan);

        LoanRepayment repayment = LoanRepayment.builder()
                .repaymentNumber(generateRepaymentNumber())
                .loanNumber(loanNumber)
                .customerId(customerId)
                .amount(amount)
                .remainingAmount(newRemainingAmount)
                .status(RepaymentStatus.SUCCESS)
                .build();

        LoanRepayment saved =
                repaymentRepository.save(repayment);

        transactionServiceClient.createTransaction(
                CreateTransactionRequest.builder()
                        .destinationAccountNumber(loan.getAccountNumber())
                        .amount(amount)
                        .transactionType(TransactionType.LOAN_REPAYMENT)
                        .description("Loan repayment - " + loanNumber)
                        .build()
        );

        return mapToResponse(saved);
    }

    @Override
    public List<RepaymentResponse> getRepayments(
            String loanNumber) {

        return repaymentRepository
                .findByLoanNumber(loanNumber)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private String generateRepaymentNumber() {
        return "REP-" +
                UUID.randomUUID()
                        .toString()
                        .substring(0, 8)
                        .toUpperCase();
    }

    private RepaymentResponse mapToResponse(
            LoanRepayment repayment) {

        return new RepaymentResponse(
                repayment.getRepaymentNumber(),
                repayment.getLoanNumber(),
                repayment.getCustomerId(),
                repayment.getAmount(),
                repayment.getRemainingAmount(),
                repayment.getStatus(),
                repayment.getPaymentDate()
        );
    }
}