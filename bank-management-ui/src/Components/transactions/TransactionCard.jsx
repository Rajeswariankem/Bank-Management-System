import "./TransactionCard.css";

const TransactionCard = ({ transaction, onSelect }) => {

    const isIncoming =
        transaction.destinationAccountNumber &&
        transaction.destinationAccountNumber !==
            transaction.sourceAccountNumber;

    const formatAmount = (amount) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR"
        }).format(amount);
    };

    const formatDate = (date) => {
        if (!date) {
            return "N/A";
        }

        return new Date(date).toLocaleString("en-IN", {
            dateStyle: "medium",
            timeStyle: "short"
        });
    };

    const getStatusClass = (status) => {
        switch (status) {
            case "SUCCESS":
                return "transaction-status-success";

            case "FAILED":
                return "transaction-status-failed";

            case "PENDING":
                return "transaction-status-pending";

            default:
                return "transaction-status-default";
        }
    };

    const getTypeLabel = (type) => {
        switch (type) {
            case "DEPOSIT":
                return "Deposit";

            case "WITHDRAW":
                return "Withdrawal";

            case "TRANSFER":
                return "Transfer";

            case "LOAN_DISBURSEMENT":
                return "Loan Disbursement";

            default:
                return type || "Transaction";
        }
    };

    return (
        <div
            className="transaction-card"
            onClick={() => onSelect(transaction)}
            role="button"
            tabIndex="0"
            onKeyDown={(event) => {
                if (
                    event.key === "Enter" ||
                    event.key === " "
                ) {
                    onSelect(transaction);
                }
            }}
        >

            <div className="transaction-card-header">

                <div className="transaction-type-section">

                    <div
                        className={`transaction-type-icon ${
                            isIncoming
                                ? "incoming"
                                : "outgoing"
                        }`}
                    >
                        {isIncoming ? "↓" : "↑"}
                    </div>

                    <div>
                        <h3>
                            {getTypeLabel(
                                transaction.transactionType
                            )}
                        </h3>

                        <p>
                            {transaction.transactionId}
                        </p>
                    </div>

                </div>

                <span
                    className={`transaction-status ${getStatusClass(
                        transaction.transactionStatus
                    )}`}
                >
                    {transaction.transactionStatus}
                </span>

            </div>

            <div className="transaction-card-body">

                <div className="transaction-amount-section">

                    <span className="transaction-label">
                        Amount
                    </span>

                    <span
                        className={`transaction-amount ${
                            isIncoming
                                ? "amount-incoming"
                                : "amount-outgoing"
                        }`}
                    >
                        {isIncoming ? "+" : "-"}
                        {formatAmount(transaction.amount)}
                    </span>

                </div>

                <div className="transaction-details">

                    <div className="transaction-detail">

                        <span className="transaction-label">
                            From
                        </span>

                        <span className="transaction-value">
                            {transaction.sourceAccountNumber ||
                                "N/A"}
                        </span>

                    </div>

                    <div className="transaction-detail">

                        <span className="transaction-label">
                            To
                        </span>

                        <span className="transaction-value">
                            {transaction.destinationAccountNumber ||
                                "N/A"}
                        </span>

                    </div>

                    <div className="transaction-detail">

                        <span className="transaction-label">
                            Date
                        </span>

                        <span className="transaction-value">
                            {formatDate(
                                transaction.createdAt
                            )}
                        </span>

                    </div>

                </div>

                {transaction.description && (
                    <div className="transaction-description">

                        <span className="transaction-label">
                            Description
                        </span>

                        <p>
                            {transaction.description}
                        </p>

                    </div>
                )}

                <div className="transaction-view-details">
                    Click to view details
                </div>

            </div>

        </div>
    );
};

export default TransactionCard;