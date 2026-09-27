import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    getLoan,
    getEmiSchedule,
    getRepayments,
    payEmi,
    makeRepayment
} from "../services/loanService";
import "./LoanDetails.css";
import BackToDashboard from "../components/BackToDashboard";

const LoanDetails = () => {
    const { loanNumber } = useParams();
    const navigate = useNavigate();

    const [loan, setLoan] = useState(null);
    const [emis, setEmis] = useState([]);
    const [repayments, setRepayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [paymentEmi, setPaymentEmi] = useState(null);
    const [emiAmount, setEmiAmount] = useState("");
    const [repaymentAmount, setRepaymentAmount] = useState("");
    const [showRepayment, setShowRepayment] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [actionError, setActionError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        loadLoanDetails();
    }, [loanNumber]);

    const loadLoanDetails = async () => {
        try {
            setLoading(true);
            setError("");

            const [
                loanData,
                emiData,
                repaymentData
            ] = await Promise.all([
                getLoan(loanNumber),
                getEmiSchedule(loanNumber),
                getRepayments(loanNumber)
            ]);

            setLoan(loanData);
            setEmis(emiData);
            setRepayments(repaymentData);
        } catch (error) {
            console.error(
                "Failed to load loan details:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to load loan details."
            );
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return Number(amount || 0).toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 2
            }
        );
    };

    const formatDate = (date) => {
        if (!date) {
            return "-";
        }

        return new Date(date).toLocaleDateString(
            "en-IN"
        );
    };

    const formatDateTime = (date) => {
        if (!date) {
            return "-";
        }

        return new Date(date).toLocaleString(
            "en-IN"
        );
    };

    const handlePayEmi = async (emi) => {
        try {
            setActionLoading(true);
            setActionError("");
            setSuccessMessage("");

            const amount =
                emiAmount || emi.amount;

            const response = await payEmi(
                loanNumber,
                emi.emiNumber,
                amount
            );

            setSuccessMessage(
                `EMI payment successful. Payment: ${response.repaymentNumber || ""}`
            );

            setPaymentEmi(null);
            setEmiAmount("");

            await loadLoanDetails();
        } catch (error) {
            console.error(
                "EMI payment failed:",
                error
            );

            setActionError(
                error.response?.data?.message ||
                "Unable to process EMI payment."
            );
        } finally {
            setActionLoading(false);
        }
    };

    const handleRepayment = async (event) => {
        event.preventDefault();

        try {
            setActionLoading(true);
            setActionError("");
            setSuccessMessage("");

            const response = await makeRepayment(
                loanNumber,
                repaymentAmount
            );

            setSuccessMessage(
                `Repayment successful. Payment: ${response.repaymentNumber || ""}`
            );

            setRepaymentAmount("");
            setShowRepayment(false);

            await loadLoanDetails();
        } catch (error) {
            console.error(
                "Repayment failed:",
                error
            );

            setActionError(
                error.response?.data?.message ||
                "Unable to process repayment."
            );
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="loan-details-page">
                <div className="loan-details-loading">
                    Loading loan details...
                </div>
            </div>
        );
    }

    if (error || !loan) {
        return (
            <div className="loan-details-page">
                <div className="loan-details-error">
                    <p>
                        {error || "Loan not found."}
                    </p>

                    <button
                        onClick={() =>
                            navigate("/loans")
                        }
                    >
                        Back to Loans
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="loan-details-page">

            <div className="loan-details-top">

                <div className="loan-navigation-buttons">
                    {/* <BackToDashboard /> */}

                    <button
                        className="back-to-loans-button"
                        onClick={() =>
                            navigate("/loans")
                        }
                    >
                        ← Back to Loans
                    </button>
                </div>

                <button
                    className="repayment-button"
                    onClick={() => {
                        setActionError("");
                        setShowRepayment(true);
                    }}
                >
                    Make Repayment
                </button>

            </div>

            <div className="loan-details-header">

                <div className="loan-details-title">

                    <div className="loan-details-icon">
                        ₹
                    </div>

                    <div>
                        <h2>
                            {loan.loanType} Loan
                        </h2>

                        <p>
                            {loan.loanNumber}
                        </p>
                    </div>

                </div>

                <span
                    className={`loan-details-status ${loan.status.toLowerCase()}`}
                >
                    {loan.status}
                </span>

            </div>

            {successMessage && (
                <div className="loan-success-message">
                    {successMessage}
                </div>
            )}

            {actionError && (
                <div className="loan-action-error">
                    {actionError}
                </div>
            )}

            <div className="loan-summary-grid">

                <div className="loan-summary-card">
                    <span>Loan Amount</span>

                    <strong>
                        ₹{formatCurrency(
                            loan.loanAmount
                        )}
                    </strong>
                </div>

                <div className="loan-summary-card">
                    <span>Remaining Amount</span>

                    <strong>
                        ₹{formatCurrency(
                            loan.remainingAmount
                        )}
                    </strong>
                </div>

                <div className="loan-summary-card">
                    <span>Monthly EMI</span>

                    <strong>
                        ₹{formatCurrency(
                            loan.monthlyEmi
                        )}
                    </strong>
                </div>

                <div className="loan-summary-card">
                    <span>Interest Rate</span>

                    <strong>
                        {loan.interestRate}%
                    </strong>
                </div>

            </div>

            <div className="loan-information-card">

                <h3>
                    Loan Information
                </h3>

                <div className="loan-information-grid">

                    <div>
                        <span>Loan Number</span>

                        <strong>
                            {loan.loanNumber}
                        </strong>
                    </div>

                    <div>
                        <span>Account Number</span>

                        <strong>
                            {loan.accountNumber}
                        </strong>
                    </div>

                    <div>
                        <span>Loan Type</span>

                        <strong>
                            {loan.loanType}
                        </strong>
                    </div>

                    <div>
                        <span>Tenure</span>

                        <strong>
                            {loan.tenureMonths} months
                        </strong>
                    </div>

                    <div>
                        <span>Created At</span>

                        <strong>
                            {formatDateTime(
                                loan.createdAt
                            )}
                        </strong>
                    </div>

                    <div>
                        <span>Disbursed At</span>

                        <strong>
                            {formatDateTime(
                                loan.disbursedAt
                            )}
                        </strong>
                    </div>

                </div>

            </div>

            <div className="emi-section">

                <div className="section-title">

                    <div>
                        <h3>
                            EMI Schedule
                        </h3>

                        <p>
                            View and manage your installments
                        </p>
                    </div>

                </div>

                {emis.length === 0 ? (
                    <div className="no-data">
                        No EMI schedule available.
                    </div>
                ) : (
                    <div className="emi-table-wrapper">

                        <table className="emi-table">

                            <thead>
                                <tr>
                                    <th>EMI</th>
                                    <th>Due Date</th>
                                    <th>Amount</th>
                                    <th>Remaining</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody>

                                {emis.map((emi) => (
                                    <tr key={emi.emiNumber}>

                                        <td>
                                            #{emi.installmentNumber}
                                        </td>

                                        <td>
                                            {formatDate(
                                                emi.dueDate
                                            )}
                                        </td>

                                        <td>
                                            ₹{formatCurrency(
                                                emi.amount
                                            )}
                                        </td>

                                        <td>
                                            ₹{formatCurrency(
                                                emi.remainingAmount
                                            )}
                                        </td>

                                        <td>
                                            <span
                                                className={`emi-status ${emi.status.toLowerCase()}`}
                                            >
                                                {emi.status}
                                            </span>
                                        </td>

                                        <td>

                                            {emi.status === "PENDING" ? (
                                                <button
                                                    className="pay-emi-button"
                                                    onClick={() => {
                                                        setPaymentEmi(emi);
                                                        setEmiAmount(
                                                            emi.amount
                                                        );
                                                        setActionError("");
                                                    }}
                                                >
                                                    Pay EMI
                                                </button>
                                            ) : (
                                                <span className="paid-text">
                                                    {emi.paidDate
                                                        ? `Paid ${formatDate(
                                                            emi.paidDate
                                                        )}`
                                                        : "Completed"}
                                                </span>
                                            )}

                                        </td>

                                    </tr>
                                ))}

                            </tbody>

                        </table>

                    </div>
                )}

            </div>

            <div className="repayments-section">

                <div className="section-title">

                    <div>
                        <h3>
                            Repayment History
                        </h3>

                        <p>
                            Your previous loan repayments
                        </p>
                    </div>

                </div>

                {repayments.length === 0 ? (
                    <div className="no-data">
                        No repayments found.
                    </div>
                ) : (
                    <div className="repayments-list">

                        {repayments.map((repayment) => (
                            <div
                                className="repayment-item"
                                key={repayment.repaymentNumber}
                            >

                                <div>

                                    <strong>
                                        {repayment.repaymentNumber}
                                    </strong>

                                    <span>
                                        {formatDateTime(
                                            repayment.paymentDate
                                        )}
                                    </span>

                                </div>

                                <div>

                                    <strong>
                                        ₹{formatCurrency(
                                            repayment.amount
                                        )}
                                    </strong>

                                    <span
                                        className={`repayment-status ${repayment.status.toLowerCase()}`}
                                    >
                                        {repayment.status}
                                    </span>

                                </div>

                            </div>
                        ))}

                    </div>
                )}

            </div>

            {paymentEmi && (
                <div className="loan-modal-overlay">

                    <div className="loan-payment-modal">

                        <div className="payment-modal-header">

                            <div>
                                <h3>
                                    Pay EMI
                                </h3>

                                <p>
                                    EMI #{paymentEmi.installmentNumber}
                                </p>
                            </div>

                            <button
                                className="loan-modal-close"
                                onClick={() => {
                                    setPaymentEmi(null);
                                    setEmiAmount("");
                                }}
                            >
                                ×
                            </button>

                        </div>

                        <div className="payment-info">

                            <span>
                                EMI Amount
                            </span>

                            <strong>
                                ₹{formatCurrency(
                                    paymentEmi.amount
                                )}
                            </strong>

                        </div>

                        <div className="payment-input-group">

                            <label>
                                Payment Amount
                            </label>

                            <div className="payment-amount-input">

                                <span>
                                    ₹
                                </span>

                                <input
                                    type="number"
                                    value={emiAmount}
                                    onChange={(event) =>
                                        setEmiAmount(
                                            event.target.value
                                        )
                                    }
                                    min="0.01"
                                    step="0.01"
                                />

                            </div>

                        </div>

                        <div className="payment-actions">

                            <button
                                className="payment-cancel-button"
                                onClick={() => {
                                    setPaymentEmi(null);
                                    setEmiAmount("");
                                }}
                                disabled={actionLoading}
                            >
                                Cancel
                            </button>

                            <button
                                className="payment-submit-button"
                                onClick={() =>
                                    handlePayEmi(paymentEmi)
                                }
                                disabled={actionLoading}
                            >
                                {actionLoading
                                    ? "Processing..."
                                    : "Pay EMI"}
                            </button>

                        </div>

                    </div>

                </div>
            )}

            {showRepayment && (
                <div className="loan-modal-overlay">

                    <div className="loan-payment-modal">

                        <div className="payment-modal-header">

                            <div>
                                <h3>
                                    Make Repayment
                                </h3>

                                <p>
                                    Pay towards your outstanding loan
                                </p>
                            </div>

                            <button
                                className="loan-modal-close"
                                onClick={() =>
                                    setShowRepayment(false)
                                }
                            >
                                ×
                            </button>

                        </div>

                        <div className="payment-info">

                            <span>
                                Remaining Amount
                            </span>

                            <strong>
                                ₹{formatCurrency(
                                    loan.remainingAmount
                                )}
                            </strong>

                        </div>

                        <form
                            onSubmit={handleRepayment}
                        >

                            <div className="payment-input-group">

                                <label>
                                    Repayment Amount
                                </label>

                                <div className="payment-amount-input">

                                    <span>
                                        ₹
                                    </span>

                                    <input
                                        type="number"
                                        value={repaymentAmount}
                                        onChange={(event) =>
                                            setRepaymentAmount(
                                                event.target.value
                                            )
                                        }
                                        min="0.01"
                                        step="0.01"
                                        required
                                    />

                                </div>

                            </div>

                            <div className="payment-actions">

                                <button
                                    type="button"
                                    className="payment-cancel-button"
                                    onClick={() =>
                                        setShowRepayment(false)
                                    }
                                    disabled={actionLoading}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="payment-submit-button"
                                    disabled={actionLoading}
                                >
                                    {actionLoading
                                        ? "Processing..."
                                        : "Make Repayment"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>
            )}

        </div>
    );
};

export default LoanDetails;

