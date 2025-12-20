import axios from "axios";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});

export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

export const handleApiError = (error: any) => {
    if (error.response && error.response.data && error.response.data.message) {
        return error.response.data.message;
    }
    return "An unexpected error occurred.";
};
