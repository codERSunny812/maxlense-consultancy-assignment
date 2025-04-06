// src/api/axios.js
import axios from "axios";

const instance = axios.create({
    baseURL: "http://localhost:3000/api", // replace with your backend URL
    withCredentials: true,
});

export default instance;
