import "./AccountCard.css";

const AccountCard = ({
    account,
    onSelect
}) => {

    const formatBalance = (balance) => {
        return Number(balance || 0).toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );
    };

    const statusClass =
        account.status?.toLowerCase() || "default";

    return (
        <div className="account-card">

            <div className="account-card-header">

                <div className="account-type-section">

                    <span className="account-icon">
                        ₹
                    </span>

                    <div>
                        <h3>
                            {account.accountType}
                        </h3>

                        <p>
                            Bank Account
                        </p>
                    </div>

                </div>

                <span
                    className={`account-status ${statusClass}`}
                >
                    {account.status}
                </span>

            </div>

            <div className="account-balance-section">

                <span>
                    Available Balance
                </span>

                <strong>
                    ₹{formatBalance(account.balance)}
                </strong>

            </div>

            <div className="account-number-section">

                <span>
                    Account Number
                </span>

                <strong>
                    {account.accountNumber}
                </strong>

            </div>

            <div className="account-actions">

                <button
                    className="deposit-button"
                    onClick={() => {
                        console.log(
                            "Deposit:",
                            account.accountNumber
                        );
                    }}
                >
                    Deposit
                </button>

                <button
                    className="withdraw-button"
                    onClick={() => {
                        console.log(
                            "Withdraw:",
                            account.accountNumber
                        );
                    }}
                >
                    Withdraw
                </button>

                <button
                    className="transfer-button"
                    onClick={() => {
                        console.log(
                            "Transfer:",
                            account.accountNumber
                        );
                    }}
                >
                    Transfer
                </button>

            </div>

            <div className="account-card-footer">

                <button
                    className="account-details-button"
                    onClick={() => onSelect(account)}
                >
                    View Details
                </button>

            </div>

        </div>
    );
};

export default AccountCard;