import axios from "axios";

export const baseURL = process.env.API_URL;

const api = axios.create({
    baseURL: baseURL,
    withCredentials: true,
});

export { api }
