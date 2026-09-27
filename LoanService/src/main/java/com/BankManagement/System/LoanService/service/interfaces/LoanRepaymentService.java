package com.BankManagement.System.LoanService.service.interfaces;

import com.BankManagement.System.LoanService.dto.request.RepaymentRequest;
import com.BankManagement.System.LoanService.dto.response.RepaymentResponse;

import java.util.List;

public interface LoanRepaymentService {

    RepaymentResponse makeRepayment(
            String loanNumber,
            Long customerId,
            RepaymentRequest request
    );

    List<RepaymentResponse> getRepayments(String loanNumber);
}