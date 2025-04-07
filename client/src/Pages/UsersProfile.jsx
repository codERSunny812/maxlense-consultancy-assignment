// src/pages/UserProfile.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "../api/axios";
import { IoIosArrowRoundBack } from "react-icons/io";

const UserProfile = () => {
    const { id } = useParams();
    console.log("user id from params")
    console.log(id)
    const [user, setUser] = useState(null);
    const userRole = JSON.parse(localStorage.getItem("user"))?.role;


    const navigate = useNavigate()
    

    const fetchUser = async () => {
        try {
            const res = await axios.get(`/user/${id}`);
            setUser(res.data);
        } catch (err) {
            console.error("Failed to fetch user profile", err);
        }
    };

    useEffect(() => {
        fetchUser();
    }, [id]);

    if (!user) {
        return (
            <div className="min-h-screen flex justify-center items-center text-lg">
                Loading...
            </div>
        );
    }


    const handleDelete = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete this user?");
        if (!confirmDelete) return;

        try {
            await axios.delete(`/user/admin/delete-user/${id}`);
            alert("User deleted successfully");
            navigate("/home"); // redirect to user list page
        } catch (err) {
            console.error("Error deleting user:", err);
            alert("Error deleting user");
        }
    };


    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-10 px-4">
            <div className="flex justify-start w-full max-w-md mb-4">  
            <Link to="/home">
            <IoIosArrowRoundBack className="text-3xl text-blue-500" />
            </Link>        
           
            </div>
          
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
                <div className="flex flex-col items-center">
                    <img
                        src={user.profileImage}
                        alt={user.name}
                        className="w-28 h-28 rounded-full object-cover border-4 border-blue-500 mb-4"
                    />
                    <h2 className="text-2xl font-bold text-gray-800">
                        
                        {user.name}
                        </h2>
                    <p className="text-gray-600 mt-1">
                        
                        {user.email}
                        </p>
                    <span className="mt-2 inline-block bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full">
                       
                       Role: {user.role}
                    </span>

                    {/* Admin Edit Button */}
                    {userRole === "admin" && (

                        <div className="flex gap-3  items-center mt-4">
                        <button
                            onClick={() => navigate(`/admin/user/${id}`)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md mt-4"
                        >
                            Edit User
                        </button>


                        <button
                            onClick={handleDelete}
                            className="px-4 py-2 bg-red-600 text-white rounded-md mt-4"
                        >
                            delete User
                        </button>

                        </div>


                    )}
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
