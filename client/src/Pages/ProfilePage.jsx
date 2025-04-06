import React, { useEffect, useState } from "react";
import axios from "../api/axios";

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        password: "",
    });

    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get("/user/profile", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUser(res.data.user);
                setFormData((prev) => ({ ...prev, name: res.data.user.name }));
                setImagePreview(res.data.user.profileImage);
            } catch (err) {
                console.error(err);
                alert("Failed to load profile.");
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData((prev) => ({ ...prev, profileImage: file }));
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append("name", formData.name);
        if (formData.password) data.append("password", formData.password);
        if (formData.profileImage) data.append("profileImage", formData.profileImage);

        try {
            const res = await axios.put("/user/profile", data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            });
            alert(res.data.message || "Profile updated successfully!");
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Profile update failed");
        }
    };

    if (!user) return <p className="text-center mt-20">Loading profile...</p>;

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded-2xl space-y-4">
            <h2 className="text-2xl font-semibold text-center mb-4">My Profile</h2>

            <div className="flex justify-center">
                <img
                    src={imagePreview || "/default-avatar.png"}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover border"
                />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
                <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                />

                <input
                    type="password"
                    name="password"
                    placeholder="New Password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                />

                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full p-2 border rounded"
                />

                <button
                    type="submit"
                    className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
                >
                    Update Profile
                </button>
            </form>

            <div className="text-sm text-gray-500 mt-4">
                <p><strong>Username:</strong> {user.username}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Role:</strong> {user.role}</p>
            </div>
        </div>
    );
};

export default ProfilePage;
