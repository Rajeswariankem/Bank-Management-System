import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080",
    headers: {
        "Content-Type": "application/json"
    }
});

api.interceptors.request.use(
    (config) => {

        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");

        console.log("Request:", `${config.baseURL}${config.url}`);
        console.log("Authorization:", token ? `Bearer ${token}` : null);
        console.log("X-User-Id:", userId);

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        if (userId) {
            config.headers["X-User-Id"] = userId;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    (error) => {

        if (error.response?.status === 401) {

            localStorage.removeItem("token");
            localStorage.removeItem("userId");
            localStorage.removeItem("username");
            localStorage.removeItem("role");

            window.location.href = "/login";
        }

        return Promise.reject(error);
    }
);

export default api;