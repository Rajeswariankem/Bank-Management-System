import "./LoanDetailsModal.css";

const LoanDetailsModal = ({ loan, onClose }) => {

    if (!loan) {
        return null;
    }

    const formatCurrency = (amount) => {
        return `₹${Number(amount || 0).toLocaleString("en-IN", {
            minimumFractionDigits: 2
        })}`;
    };

    const formatLoanType = (type) => {
        return type
            ?.replaceAll("_", " ")
            .toLowerCase()
            .replace(/\b\w/g, (char) => char.toUpperCase()) || "Loan";
    };

    const formatDate = (date) => {
        if (!date) {
            return "-";
        }

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return "-";
        }

        return parsedDate.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    };

    const status = loan.status?.toLowerCase() || "pending";

    return (
        <div
            className="loan-details-overlay"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                    onClose();
                }
            }}
        >
            <div className="loan-details-modal">

                <div className="loan-details-header">

                    <div className="loan-details-title">

                        <div className="loan-details-icon">
                            ₹
                        </div>

                        <div>
                            <h2>
                                {formatLoanType(loan.loanType)}
                            </h2>

                            <p>
                                Loan #{loan.loanNumber || "-"}
                            </p>
                        </div>

                    </div>

                    <button
                        type="button"
                        className="loan-details-close"
                        onClick={onClose}
                    >
                        ×
                    </button>

                </div>

                <div className="loan-details-status-row">

                    <span className="loan-details-status-label">
                        Application Status
                    </span>

                    <span
                        className={`loan-details-status ${status}`}
                    >
                        {loan.status || "PENDING"}
                    </span>

                </div>

                <div className="loan-details-main-amount">

                    <span>Loan Amount</span>

                    <strong>
                        {formatCurrency(loan.loanAmount)}
                    </strong>

                </div>

                <div className="loan-details-grid">

                    <div className="loan-info-item">
                        <span>Monthly EMI</span>
                        <strong>
                            {formatCurrency(loan.monthlyEmi)}
                        </strong>
                    </div>

                    <div className="loan-info-item">
                        <span>Interest Rate</span>
                        <strong>
                            {loan.interestRate != null
                                ? `${loan.interestRate}%`
                                : "-"}
                        </strong>
                    </div>

                    <div className="loan-info-item">
                        <span>Remaining Amount</span>
                        <strong>
                            {formatCurrency(loan.remainingAmount)}
                        </strong>
                    </div>

                    <div className="loan-info-item">
                        <span>Tenure</span>
                        <strong>
                            {loan.tenureMonths
                                ? `${loan.tenureMonths} months`
                                : "-"}
                        </strong>
                    </div>

                    <div className="loan-info-item">
                        <span>Account Number</span>
                        <strong>
                            {loan.accountNumber || "-"}
                        </strong>
                    </div>

                    <div className="loan-info-item">
                        <span>Loan Type</span>
                        <strong>
                            {formatLoanType(loan.loanType)}
                        </strong>
                    </div>

                    <div className="loan-info-item">
                        <span>Application Date</span>
                        <strong>
                            {formatDate(loan.createdAt)}
                        </strong>
                    </div>

                    <div className="loan-info-item">
                        <span>Last Updated</span>
                        <strong>
                            {formatDate(loan.updatedAt)}
                        </strong>
                    </div>

                    <div className="loan-info-item">
                        <span>Disbursed Date</span>
                        <strong>
                            {formatDate(loan.disbursedAt)}
                        </strong>
                    </div>

                </div>

                <div className="loan-details-footer">

                    <button
                        type="button"
                        className="loan-details-close-button"
                        onClick={onClose}
                    >
                        Close
                    </button>

                </div>

            </div>
        </div>
    );
};

export default LoanDetailsModal;