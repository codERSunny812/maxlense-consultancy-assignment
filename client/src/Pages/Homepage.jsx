import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../Component/Navbar";

const UserList = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loggedUser, setLoggedUser] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`/user/all?keyword=${debouncedSearch}&page=${page}&limit=8`);
      const filteredUsers = res.data.users.filter(u => u.id !== loggedUser?.id);
      setUsers(filteredUsers);
      setTotalPages(res.data.pages);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const fetchLoggedUser = async () => {
    try {
      const res = await axios.get(`/user/${user?.id}`);
      setLoggedUser(res.data);
    } catch (err) {
      console.error("Error fetching logged-in user:", err);
    }
  };

  // const handleEdit = (user) => {
  //   navigate(`admin/user/${user.id}`);
  // };

  const handleUserClick = (userId) => {
    navigate(`/user/${userId}`);
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this user?");
    if (!confirm) return;

    try {
      await axios.delete(`/user/admin/delete-user/${id}`);
      alert("User deleted successfully");
      fetchUsers(); // Refresh the list after deletion
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Failed to delete user");
    }
  };

  useEffect(() => {
    fetchLoggedUser();
  }, []);

  useEffect(() => {
    if (loggedUser) {
      fetchUsers();
    }
  }, [debouncedSearch, page, loggedUser]);

  return (
    <>
      <Navbar loggedUser={loggedUser} />
      <div className="p-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center">User Directory</h2>

        <div className="mb-6 flex justify-center">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-lg p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {users.length > 0 ? (
            users.map((user) => (
              <div
                key={user.id}
                className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition-all flex justify-between items-center"
              >
                <div
                  onClick={() => handleUserClick(user.id)}
                  className="flex items-center gap-4 cursor-pointer w-full hover:bg-gray-50 p-2 rounded-lg"
                >
                  {user.profileImage && (
                    <img
                      src={user.profileImage}
                      alt={user.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <p className="font-semibold text-lg">{user.name}</p>
                  </div>
                </div>

                {loggedUser?.role === "admin" && (
                  <div className="flex gap-3 ml-4">
                    <button
                      className="text-blue-600 hover:underline"
                    >
                      <Link to={`/admin/user/${user.id}`}>
                      Edit
                      </Link>
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-center col-span-full text-gray-500">No users found.</p>
          )}
        </div>

        {
        totalPages > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`px-4 py-2 rounded-md font-medium transition ${p === page
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
                  }`}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default UserList;
