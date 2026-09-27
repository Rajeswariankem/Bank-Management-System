package com.BankManagement.System.LoanService.service.impl;

import com.BankManagement.System.LoanService.client.AccountServiceClient;
import com.BankManagement.System.LoanService.client.NotificationClient;
import com.BankManagement.System.LoanService.dto.Request.ApplyLoanRequest;
import com.BankManagement.System.LoanService.dto.Response.LoanResponse;
import com.BankManagement.System.LoanService.dto.event.LoanEvent;

import com.BankManagement.System.LoanService.dto.request.NotificationRequest;
import com.BankManagement.System.LoanService.dto.response.AccountResponse;
import com.BankManagement.System.LoanService.entity.Loan;
import com.BankManagement.System.LoanService.enums.AccountStatus;
import com.BankManagement.System.LoanService.enums.LoanStatus;

import com.BankManagement.System.LoanService.repository.LoanRepository;
import com.BankManagement.System.LoanService.service.interfaces.LoanEmiService;
import com.BankManagement.System.LoanService.service.interfaces.LoanService;
import com.BankManagement.System.LoanService.util.LoanNumberGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.BankManagement.System.LoanService.dto.Request.DepositRequest;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LoanServiceImpl implements LoanService {
    private final AccountServiceClient accountServiceClient;
    private final LoanRepository loanRepository;
    private final LoanNumberGenerator loanNumberGenerator;
    private final LoanEmiService loanEmiService;
    private final NotificationClient notificationClient;
    @Override
    @Transactional
    public LoanResponse applyForLoan(
            Long customerId,
            String authorization,
            ApplyLoanRequest request
    ) {
        AccountResponse account =
                accountServiceClient.getAccount(
                        request.getAccountNumber(),
                        authorization
                );

        if (!account.customerId().equals(customerId)) {
            throw new IllegalStateException(
                    "You cannot apply for a loan using another customer's account."
            );
        }

        if (account.status() != AccountStatus.ACTIVE) {
            throw new IllegalStateException(
                    "Loan can only be applied using an active account."
            );
        }

        String loanNumber;

        do {
            loanNumber = loanNumberGenerator.generate();
        } while (loanRepository.existsByLoanNumber(loanNumber));
        BigDecimal interestRate = BigDecimal.valueOf(10.00);

        Loan loan = Loan.builder()
                .loanNumber(loanNumber)
                .customerId(customerId)
                .accountNumber(request.getAccountNumber())
                .loanType(request.getLoanType())
                .loanAmount(request.getLoanAmount())
                .interestRate(interestRate)
                .tenureMonths(request.getTenureMonths())
                .monthlyEmi(calculateEmi(
                        request.getLoanAmount(),
                        interestRate,
                        request.getTenureMonths()
                ))
                .remainingAmount(request.getLoanAmount())
                .status(LoanStatus.PENDING)
                .build();

        Loan savedLoan = loanRepository.save(loan);

        return mapToResponse(savedLoan);
    }
    @Override
    @Transactional
    public LoanResponse disburseLoan(
            String loanNumber,
            String authorization
    ){

        Loan loan = loanRepository
                .findByLoanNumber(loanNumber)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Loan not found: " + loanNumber
                        ));

        if (loan.getStatus() != LoanStatus.APPROVED) {
            throw new IllegalStateException(
                    "Only approved loans can be disbursed."
            );
        }

        DepositRequest depositRequest = new DepositRequest();
        depositRequest.setAmount(loan.getLoanAmount());

        accountServiceClient.loanDisbursement(
                loan.getAccountNumber(),
                authorization,
                depositRequest
        );

        loan.setStatus(LoanStatus.DISBURSED);
        loan.setDisbursedAt(LocalDateTime.now());

        Loan savedLoan = loanRepository.save(loan);

        return mapToResponse(savedLoan);
    }
    @Override
    public LoanResponse getLoan(String loanNumber) {

        Loan loan = loanRepository
                .findByLoanNumber(loanNumber)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Loan not found: " + loanNumber
                        ));

        return mapToResponse(loan);
    }


    @Override
    public List<LoanResponse> getCustomerLoans(Long customerId) {

        return loanRepository
                .findByCustomerId(customerId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }


    @Override
    @Transactional
    public LoanResponse approveLoan(String loanNumber) {

        Loan loan = loanRepository
                .findByLoanNumber(loanNumber)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Loan not found: " + loanNumber
                        ));

        if (loan.getStatus() != LoanStatus.PENDING) {
            throw new IllegalStateException(
                    "Only pending loans can be approved."
            );
        }

        loan.setStatus(LoanStatus.APPROVED);

        Loan savedLoan = loanRepository.save(loan);
        NotificationRequest notification = new NotificationRequest(
                savedLoan.getCustomerId(),
                "Your loan application has been approved successfully.",
                "LOAN_APPROVED"
        );

        notificationClient.createNotification(notification);
        loanEmiService.generateEmiSchedule(loanNumber);

        return mapToResponse(savedLoan);
    }

    @Override
    @Transactional
    public LoanResponse rejectLoan(String loanNumber) {

        Loan loan = loanRepository
                .findByLoanNumber(loanNumber)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Loan not found: " + loanNumber
                        ));

        if (loan.getStatus() != LoanStatus.PENDING) {
            throw new IllegalStateException(
                    "Only pending loans can be rejected."
            );
        }

        loan.setStatus(LoanStatus.REJECTED);

        Loan savedLoan = loanRepository.save(loan);

        return mapToResponse(savedLoan);
    }

    @Override
    public List<LoanResponse> getAllLoans() {

        return loanRepository
                .findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private LoanResponse mapToResponse(Loan loan) {

        return LoanResponse.builder()
                .loanNumber(loan.getLoanNumber())
                .customerId(loan.getCustomerId())
                .accountNumber(loan.getAccountNumber())
                .loanType(loan.getLoanType())
                .loanAmount(loan.getLoanAmount())
                .interestRate(loan.getInterestRate())
                .tenureMonths(loan.getTenureMonths())
                .monthlyEmi(loan.getMonthlyEmi())
                .status(loan.getStatus())
                .createdAt(loan.getCreatedAt())
                .remainingAmount(loan.getRemainingAmount())
                .disbursedAt(loan.getDisbursedAt())
                .build();
    }

    private BigDecimal calculateEmi(
            BigDecimal principal,
            BigDecimal annualInterestRate,
            int tenureMonths) {

        BigDecimal monthlyRate = annualInterestRate
                .divide(
                        BigDecimal.valueOf(12 * 100),
                        10,
                        RoundingMode.HALF_UP
                );

        double p = principal.doubleValue();
        double r = monthlyRate.doubleValue();
        int n = tenureMonths;

        double emi;

        if (r == 0) {
            emi = p / n;
        } else {
            emi = p * r * Math.pow(1 + r, n)
                    / (Math.pow(1 + r, n) - 1);
        }

        return BigDecimal.valueOf(emi)
                .setScale(2, RoundingMode.HALF_UP);
    }
}