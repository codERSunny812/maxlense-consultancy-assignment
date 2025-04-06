import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../api/axios";

const VerifyEmail = () => {
    const { token } = useParams();
    const [message, setMessage] = useState("Verifying...");
    const [success, setSuccess] = useState(false);

    console.log("Token from URL:", token);

    useEffect(() => {

        if (!token) {
            setMessage("Invalid or missing verification token.");
            return;
        }

        const verify = async () => {
            try {
                const res = await axios.get(`/auth/verify-email/${token}`);
                console.log("Verification response:", res);
                setMessage(res.data.message || "Email verified successfully!");
                setSuccess(true);
            } catch (err) {
                setMessage(err.response?.data?.message || "Verification failed.");
            }
        };

        verify();
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div
                className={`p-6 rounded-2xl shadow-md max-w-md w-full text-center ${success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
            >
                <h2 className="text-xl font-bold mb-2">Email Verification</h2>
                <p>{message}</p>

                {
                    success && (
                        <a
                            href="/login"
                            className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
                        >
                            Go to Login
                        </a>
                    )
                }
            </div>
        </div>
    );
};

export default VerifyEmail;
