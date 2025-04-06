import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axios";

const EditUser = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [form, setForm] = useState({
        name: "",
        username: "",
        email: "",
        role: "user",
    });

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get(`/admin/user/${id}`);
                setUserData(res.data);
                setForm({
                    name: res.data.name,
                    username: res.data.username,
                    email: res.data.email,
                    role: res.data.role,
                });
            } catch (err) {
                console.error(err);
                alert("Failed to fetch user details.");
            }
        };
        fetchUser();
    }, [id]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`/admin/user/${id}`, form);
            alert("User updated successfully.");
            navigate("/users");
        } catch (err) {
            console.error(err);
            alert("Failed to update user.");
        }
    };

    if (!userData) return <p>Loading...</p>;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded-2xl shadow-md w-full max-w-md space-y-4"
            >
                <h2 className="text-2xl font-semibold text-center">Edit User</h2>

                <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Name"
                    className="w-full p-2 border rounded"
                />

                <input
                    type="text"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    placeholder="Username"
                    className="w-full p-2 border rounded"
                />

                <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Email"
                    className="w-full p-2 border rounded"
                />

                <select
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                </select>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                >
                    Update
                </button>
            </form>
        </div>
    );
};

export default EditUser;
