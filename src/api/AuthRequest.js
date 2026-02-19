import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const API = axios.create({
    baseURL: API_BASE_URL + 'auth',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

export const loginRequest = async (credentials) => {
    return API.post("/login", credentials, {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
            "Access-Control-Allow-Methods": "POST",
        }
    })
};

export const registerRequest = async (userData) => {
    return API.post("/register", userData, {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json"
        }
    })
};