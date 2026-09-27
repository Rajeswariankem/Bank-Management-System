import { useEffect, useState } from "react";
import {
    getMyNotifications
} from "../services/notificationService";
import NotificationCard from "../Components/notifications/NoticicationCard";
import "./Notifications.css";
import BackToDashboard from "../components/BackToDashboard";
const Notifications = () => {

    const [notifications, setNotifications] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadNotifications();
    }, []);

    const loadNotifications = async () => {

        try {

            setLoading(true);
            setError("");

            const data = await getMyNotifications();

            setNotifications(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (error) {

            console.error(
                "Failed to load notifications:",
                error
            );

            setError(
                error.response?.data?.message ||
                error.message ||
                "Unable to load notifications."
            );

        } finally {

            setLoading(false);

        }
    };

    const unreadCount = notifications.filter(
        notification => !notification.read
    ).length;

    if (loading) {

        return (
            <div className="notifications-page">

                <div className="notifications-loading">
                    Loading notifications...
                </div>

            </div>
        );
    }

    return (
        <div className="notifications-page">
            
                <BackToDashboard />

            

            <div className="notifications-header">

                <div>

                    <div className="notifications-title">

                        <h2>
                            Notifications
                        </h2>

                        {unreadCount > 0 && (
                            <span className="notifications-count">
                                {unreadCount}
                            </span>
                        )}

                    </div>

                    <p>
                        Stay updated with your account activity
                    </p>

                </div>

                <button
                    className="refresh-notifications-button"
                    onClick={loadNotifications}
                    disabled={loading}
                >
                    Refresh
                </button>

            </div>

            {error ? (

                <div className="notifications-error">

                    <div className="notifications-error-icon">
                        !
                    </div>

                    <h3>
                        Unable to Load Notifications
                    </h3>

                    <p>
                        {error}
                    </p>

                    <button
                        onClick={loadNotifications}
                    >
                        Try Again
                    </button>

                </div>

            ) : notifications.length === 0 ? (

                <div className="notifications-empty">

                    <div className="empty-notification-icon">
                        🔔
                    </div>

                    <h3>
                        No Notifications
                    </h3>

                    <p>
                        You don't have any notifications yet.
                    </p>

                </div>

            ) : (

                <div className="notifications-list">

                    {notifications.map(
                        notification => (
                            <NotificationCard
                                key={notification.id}
                                notification={notification}
                            />
                        )
                    )}

                </div>

            )}

        </div>
    );
};

export default Notifications;