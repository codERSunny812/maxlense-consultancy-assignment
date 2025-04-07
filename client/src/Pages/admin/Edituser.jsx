import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import Navbar from "../../Component/Navbar";

const AdminEditUser = () => {
    const {id }= useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [form, setForm] = useState({
        name: "",
        email: "",
        role: "user",
    });
    const [loading, setLoading] = useState(false);
    const [loggedUser, setLoggedUser] = useState(null);

    console.log("logged user from state",loggedUser)

    // Fetch logged-in user (to show in navbar and ensure admin)
    const fetchLoggedUser = async () => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        try {
            const res = await axios.get(`/user/${storedUser?.id}`);
            setLoggedUser(res.data);
        } catch (err) {
            console.error("Error fetching logged-in user:", err);
        }
    };

    // Fetch user to edit
    const fetchUser = async () => {
        try {
            const res = await axios.get(`/user/${id}`);
            setUser(res.data);
            setForm({
                name: res.data.name,
                email: res.data.email,
                role: res.data.role,
            });
        } catch (err) {
            console.error("Error fetching user:", err);
        }
    };

    useEffect(() => {
        fetchUser();
        fetchLoggedUser();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.put(`/user/admin/edit-user/${id}`, form);
            alert("User updated successfully");
            navigate("/home");
        } catch (err) {
            console.error("Error updating user:", err);
            alert("Error updating user");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar loggedUser={loggedUser} />

            <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-xl shadow">
                <h2 className="text-2xl font-bold mb-4 text-center">Admin Edit User</h2>

                {user ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block font-medium mb-1">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-md"
                                required
                            />
                        </div>

                        <div>
                            <label className="block font-medium mb-1">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-md"
                                required
                            />
                        </div>

                        <div>
                            <label className="block font-medium mb-1">Role</label>
                            <select
                                name="role"
                                value={form.role}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-md"
                            >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md w-full hover:bg-blue-700"
                        >
                            {loading ? "Saving..." : "Update User"}
                        </button>
                    </form>
                ) : (
                    <p className="text-center text-gray-500">Loading user details...</p>
                )}
            </div>
        </>
    );
};

export default AdminEditUser;
