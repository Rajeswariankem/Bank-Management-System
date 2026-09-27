package com.BankManagement.System.LoanService.service.interfaces;

import com.BankManagement.System.LoanService.dto.Request.ApplyLoanRequest;
import com.BankManagement.System.LoanService.dto.Response.LoanResponse;

import java.util.List;

public interface LoanService {

    LoanResponse applyForLoan(
            Long customerId,
            String authorization,
            ApplyLoanRequest request
    );

    LoanResponse getLoan(
            String loanNumber
    );

    List<LoanResponse> getCustomerLoans(
            Long customerId
    );

    LoanResponse approveLoan(
            String loanNumber
    );

    LoanResponse rejectLoan(
            String loanNumber
    );

    List<LoanResponse> getAllLoans();
    LoanResponse disburseLoan(
            String loanNumber,
            String authorization
    );
}