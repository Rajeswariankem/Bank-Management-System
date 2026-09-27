package com.BankManagement.System.LoanService.service.impl;

import com.BankManagement.System.LoanService.dto.response.RepaymentResponse;
import com.BankManagement.System.LoanService.entity.Loan;
import com.BankManagement.System.LoanService.entity.LoanEmi;
import com.BankManagement.System.LoanService.enums.EmiStatus;
import com.BankManagement.System.LoanService.enums.LoanStatus;
import com.BankManagement.System.LoanService.enums.RepaymentStatus;
import com.BankManagement.System.LoanService.enums.TransactionType;
import com.BankManagement.System.LoanService.repository.LoanEmiRepository;
import com.BankManagement.System.LoanService.repository.LoanRepository;
import com.BankManagement.System.LoanService.service.interfaces.LoanEmiService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.BankManagement.System.LoanService.client.TransactionServiceClient;
import com.BankManagement.System.LoanService.dto.request.CreateTransactionRequest;
import com.BankManagement.System.LoanService.dto.request.EmiPaymentRequest;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class LoanEmiServiceImpl implements LoanEmiService {

    private final LoanRepository loanRepository;
    private final LoanEmiRepository loanEmiRepository;
    private final TransactionServiceClient transactionServiceClient;
    @Override
    @Transactional
    public void generateEmiSchedule(String loanNumber) {

        Loan loan = loanRepository
                .findByLoanNumber(loanNumber)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Loan not found: " + loanNumber
                        ));

        if (loan.getStatus() != LoanStatus.APPROVED) {
            throw new IllegalStateException(
                    "EMI schedule can only be generated for approved loans."
            );
        }

        List<LoanEmi> existingEmis =
                loanEmiRepository
                        .findByLoanNumberOrderByInstallmentNumberAsc(
                                loanNumber
                        );

        if (!existingEmis.isEmpty()) {
            throw new IllegalStateException(
                    "EMI schedule already exists for loan: "
                            + loanNumber
            );
        }

        BigDecimal emiAmount = loan.getMonthlyEmi();

        for (int i = 1; i <= loan.getTenureMonths(); i++) {

            LocalDate dueDate =
                    LocalDate.now().plusMonths(i);

            LoanEmi emi = LoanEmi.builder()
                    .emiNumber(generateEmiNumber())
                    .loanNumber(loan.getLoanNumber())
                    .customerId(loan.getCustomerId())
                    .installmentNumber(i)
                    .amount(emiAmount)
                    .remainingAmount(emiAmount)
                    .dueDate(dueDate)
                    .status(EmiStatus.PENDING)
                    .build();

            loanEmiRepository.save(emi);
        }
    }

    @Override
    public List<LoanEmi> getEmiSchedule(String loanNumber) {

        return loanEmiRepository
                .findByLoanNumberOrderByInstallmentNumberAsc(
                        loanNumber
                );
    }

    private String generateEmiNumber() {

        return "EMI-" +
                UUID.randomUUID()
                        .toString()
                        .substring(0, 8)
                        .toUpperCase();
    }

    @Override
    @Transactional
    public RepaymentResponse payEmi(
            String loanNumber,
            String emiNumber,
            Long customerId,
            EmiPaymentRequest request) {

        Loan loan = loanRepository.findByLoanNumber(loanNumber)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Loan not found: " + loanNumber));

        if (!loan.getCustomerId().equals(customerId)) {
            throw new RuntimeException(
                    "You cannot pay EMI for another customer's loan.");
        }

        if (loan.getStatus() != LoanStatus.APPROVED) {
            throw new RuntimeException(
                    "Only approved loans can receive EMI payments.");
        }

        LoanEmi emi = loanEmiRepository
                .findByEmiNumber(emiNumber)
                .orElseThrow(() ->
                        new RuntimeException(
                                "EMI not found: " + emiNumber));

        if (!emi.getLoanNumber().equals(loanNumber)) {
            throw new RuntimeException(
                    "EMI does not belong to this loan.");
        }
        if (loan.getStatus() != LoanStatus.DISBURSED) {
            throw new RuntimeException(
                    "Only disbursed loans can receive EMI payments."
            );
        }

        if (emi.getStatus() != EmiStatus.PENDING) {
            throw new RuntimeException(
                    "This EMI has already been paid.");
        }

        if (request.getAmount().compareTo(emi.getAmount()) != 0) {
            throw new RuntimeException(
                    "Payment amount must exactly match the EMI amount.");
        }

        BigDecimal newRemainingAmount =
                loan.getRemainingAmount()
                        .subtract(request.getAmount());

        if (newRemainingAmount.compareTo(BigDecimal.ZERO) < 0) {
            throw new RuntimeException(
                    "Payment exceeds remaining loan amount.");
        }

        loan.setRemainingAmount(newRemainingAmount);

        if (newRemainingAmount.compareTo(BigDecimal.ZERO) == 0) {
            loan.setStatus(LoanStatus.COMPLETED);
        }
        if (loan.getStatus() != LoanStatus.DISBURSED) {
            throw new RuntimeException(
                    "Only disbursed loans can receive EMI payments."
            );
        }
        loanRepository.save(loan);

        emi.setStatus(EmiStatus.PAID);
        emi.setPaidDate(java.time.LocalDateTime.now());

        LoanEmi savedEmi = loanEmiRepository.save(emi);

        transactionServiceClient.createTransaction(
                CreateTransactionRequest.builder()
                        .destinationAccountNumber(loan.getAccountNumber())
                        .amount(request.getAmount())
                        .transactionType(TransactionType.LOAN_REPAYMENT)
                        .description(
                                "EMI payment - " + emiNumber
                        )
                        .build()
        );

        return new RepaymentResponse(
                emiNumber,
                loanNumber,
                customerId,
                request.getAmount(),
                newRemainingAmount,
                RepaymentStatus.SUCCESS,
                savedEmi.getPaidDate()
        );
    }
}