import "./NotificationCard.css";

const NotificationCard = ({ notification }) => {

    const getType = () => {
        if (!notification.type) {
            return "GENERAL";
        }

        return notification.type.toUpperCase();
    };

    const getTitle = () => {

        const type = getType();

        switch (type) {
            case "TRANSACTION":
                return "Transaction Notification";

            case "ACCOUNT":
                return "Account Notification";

            case "LOAN":
                return "Loan Notification";

            case "SECURITY":
                return "Security Alert";

            case "PAYMENT":
                return "Payment Notification";

            default:
                return "Notification";
        }
    };

    const getIcon = () => {

        const type = getType();

        switch (type) {
            case "TRANSACTION":
                return "₹";

            case "ACCOUNT":
                return "🏦";

            case "LOAN":
                return "💰";

            case "SECURITY":
                return "🔒";

            case "PAYMENT":
                return "💳";

            default:
                return "🔔";
        }
    };

    const formatDate = () => {

        if (!notification.createdAt) {
            return "Unknown date";
        }

        const date = new Date(notification.createdAt);

        if (Number.isNaN(date.getTime())) {
            return notification.createdAt;
        }

        return date.toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    return (
        <div
            className={`notification-card ${
                notification.read
                    ? "notification-read"
                    : "notification-unread"
            }`}
        >

            <div className="notification-icon">
                {getIcon()}
            </div>

            <div className="notification-content">

                <div className="notification-header">

                    <div className="notification-title-section">

                        <h3>
                            {getTitle()}
                        </h3>

                        {!notification.read && (
                            <span className="notification-new-badge">
                                NEW
                            </span>
                        )}

                    </div>

                    <span className="notification-type">
                        {getType()}
                    </span>

                </div>

                <p className="notification-message">
                    {notification.message}
                </p>

                <div className="notification-footer">

                    <span className="notification-date">
                        {formatDate()}
                    </span>

                    <span
                        className={`notification-status ${
                            notification.read
                                ? "read"
                                : "unread"
                        }`}
                    >
                        {notification.read
                            ? "Read"
                            : "Unread"}
                    </span>

                </div>

            </div>

        </div>
    );
};

export default NotificationCard;