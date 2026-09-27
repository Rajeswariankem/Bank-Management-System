package com.BankManagement.System.LoanService.service.interfaces;

import com.BankManagement.System.LoanService.dto.request.EmiPaymentRequest;
import com.BankManagement.System.LoanService.dto.response.RepaymentResponse;
import com.BankManagement.System.LoanService.entity.LoanEmi;

import java.util.List;

public interface LoanEmiService {

    void generateEmiSchedule(String loanNumber);

    List<LoanEmi> getEmiSchedule(String loanNumber);
    RepaymentResponse payEmi(
            String loanNumber,
            String emiNumber,
            Long customerId,
            EmiPaymentRequest request
    );
}