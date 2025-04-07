// src/pages/Profile.jsx
import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import Navbar from "../Component/Navbar";

const Profile = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    const userId = JSON?.parse(localStorage?.getItem("user"));
    const id = userId?.id;

    console.log("user id", id);

    const fetchUser = async () => {
        try {
            if (!id) {
                setError("User not logged in");
                setLoading(false);
                return;
            }

            const res = await axios.post("/user/get-profile", {
                userId: id
            });

            console.log(res);
            setUser(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching profile:", err);
            setError("Failed to fetch profile");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center text-lg">
                Loading...
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex justify-center items-center text-red-600 text-lg">
                {error}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Make Navbar more prominent */}
            <div className="mb-6">
                <Navbar loggedUser={user} />
            </div>

            <div className="flex flex-col items-center px-4">
                <div className="bg-white shadow-lg rounded-xl p-10 w-full max-w-xl">
                    <h1 className="text-3xl font-extrabold mb-6 text-center text-gray-800">My Profile</h1>

                    <div className="flex flex-col items-center space-y-4">
                        <img
                            src={user.profileImage}
                            alt="Profile"
                            className="w-32 h-32 rounded-full object-cover border-4 border-blue-500"
                        />
                        <p className="text-lg"><strong>Name:</strong> {user.name}</p>
                        <p className="text-lg"><strong>Email:</strong> {user.email}</p>
                        <p className="text-lg"><strong>Role:</strong> {user.role}</p>
                        <p className="text-lg"><strong>Verified:</strong> {user.isVerified ? "Yes" : "No"}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
