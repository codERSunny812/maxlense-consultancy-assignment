import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../api/axios";

const ResetPassword = () => {
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const {token}= useParams()

    console.log(token)

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        try {
            const res = await axios.post(`/auth/reset-password/${token}`, {
                token,
                password,
            });
            setMessage(res.data.message || "Password reset successfully!");
            setPassword("");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to reset password.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded-2xl shadow-md max-w-md w-full"
            >
                <h2 className="text-2xl font-bold mb-4 text-center">Reset Password</h2>
                {message && <p className="text-green-600 mb-2">{message}</p>}
                {error && <p className="text-red-600 mb-2">{error}</p>}

                <input
                    type="password"
                    placeholder="New Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 border rounded-lg mb-4"
                    required
                />
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                    Reset Password
                </button>
            </form>
        </div>
    );
};

export default ResetPassword;
