import api from "../Api/axios";

export const getMyNotifications = async () => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
        throw new Error("User ID not found.");
    }

    const response = await api.get(
        `/notificationservice/notifications/${userId}`
    );

    return response.data;
};

export const createNotification = async (notificationData) => {
    const response = await api.post(
        "/notificationservice/notifications",
        notificationData
    );

    return response.data;
};