import api from "../api/axios";

export const getMyLoans = async () => {
    const userId = localStorage.getItem("userId");

    console.log("LoanService userId:", userId);

    if (!userId) {
        throw new Error("User ID not found. Please login again.");
    }

    const response = await api.get(
        "/loanservice/loans/customer",
        {
            headers: {
                "X-User-Id": userId
            }
        }
    );

    return response.data;
};

export const applyForLoan = async (loanData) => {
    const userId = localStorage.getItem("userId");

    console.log("LoanService userId:", userId);

    if (!userId) {
        throw new Error("User ID not found. Please login again.");
    }

    const response = await api.post(
        "/loanservice/loans",
        loanData,
        {
            headers: {
                "X-User-Id": userId
            }
        }
    );

    return response.data;
};

export const getLoan = async (loanNumber) => {
    const response = await api.get(
        `/loanservice/loans/${loanNumber}`
    );

    return response.data;
};

export const getEmiSchedule = async (loanNumber) => {
    const response = await api.get(
        `/loanservice/loans/${loanNumber}/emis`
    );

    return response.data;
};

export const payEmi = async (
    loanNumber,
    emiNumber,
    amount
) => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
        throw new Error("User ID not found. Please login again.");
    }

    const response = await api.post(
        `/loanservice/loans/${loanNumber}/emis/${emiNumber}/pay`,
        {
            amount
        },
        {
            headers: {
                "X-User-Id": userId
            }
        }
    );

    return response.data;
};

export const makeRepayment = async (
    loanNumber,
    amount
) => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
        throw new Error("User ID not found. Please login again.");
    }

    const response = await api.post(
        `/loanservice/loans/${loanNumber}/repay`,
        {
            amount
        },
        {
            headers: {
                "X-User-Id": userId
            }
        }
    );

    return response.data;
};

export const getRepayments = async (loanNumber) => {
    const response = await api.get(
        `/loanservice/loans/${loanNumber}/repayments`
    );

    return response.data;
};