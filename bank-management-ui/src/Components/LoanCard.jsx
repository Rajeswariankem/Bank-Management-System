import "./LoanCard.css";

const LoanCard = ({ loan, onSelect }) => {

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

        return parsedDate.toLocaleDateString("en-IN");
    };

    const status = loan?.status?.toLowerCase() || "pending";

    return (
        <div className="loan-card">

            <div className="loan-card-header">

                <div className="loan-type-section">

                    <div className="loan-icon">
                        ₹
                    </div>

                    <div className="loan-type-info">
                        <h3>{formatLoanType(loan?.loanType)}</h3>
                        <p>Loan Application</p>
                    </div>

                </div>

                <span className={`loan-status ${status}`}>
                    {loan?.status || "PENDING"}
                </span>

            </div>

            <div className="loan-amount-section">

                <span>Loan Amount</span>

                <strong>
                    {formatCurrency(loan?.loanAmount)}
                </strong>

            </div>

            <div className="loan-details">

                <div className="loan-detail">
                    <span>Monthly EMI</span>
                    <strong>
                        {formatCurrency(loan?.monthlyEmi)}
                    </strong>
                </div>

                <div className="loan-detail">
                    <span>Interest Rate</span>
                    <strong>
                        {loan?.interestRate != null
                            ? `${loan.interestRate}%`
                            : "-"}
                    </strong>
                </div>

                <div className="loan-detail">
                    <span>Remaining Amount</span>
                    <strong>
                        {formatCurrency(loan?.remainingAmount)}
                    </strong>
                </div>

                <div className="loan-detail">
                    <span>Tenure</span>
                    <strong>
                        {loan?.tenureMonths
                            ? `${loan.tenureMonths} months`
                            : "-"}
                    </strong>
                </div>

                <div className="loan-detail">
                    <span>Account Number</span>
                    <strong>
                        {loan?.accountNumber || "-"}
                    </strong>
                </div>

                <div className="loan-detail">
                    <span>Created</span>
                    <strong>
                        {formatDate(loan?.createdAt)}
                    </strong>
                </div>

            </div>

            <div className="loan-card-footer">

                <button
                    type="button"
                    className="loan-details-button"
                    onClick={() => onSelect(loan)}
                >
                    View Details
                </button>

            </div>

        </div>
    );
};

export default LoanCard;