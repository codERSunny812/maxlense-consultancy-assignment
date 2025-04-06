import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loggedUser, setLoggedUser] = useState(null);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const res = await axios.get(
        `/admin/users?search=${search}&page=${page}&limit=5`
      );
      setUsers(res.data.users);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchLoggedUser = async () => {
    try {
      const res = await axios.get("/auth/profile"); // Or your actual profile route
      setLoggedUser(res.data.user);
    } catch (err) {
      console.error("Failed to fetch logged-in user");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await axios.delete(`/admin/users/${id}`);
      fetchUsers();
    } catch (err) {
      alert("Error deleting user");
    }
  };

  const handleEdit = (user) => {
    navigate(`/edit-user/${user.id}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  useEffect(() => {
    fetchUsers();
  }, [search, page]);

  useEffect(() => {
    fetchLoggedUser();
  }, []);

  return (
    <>
      {/* Navbar */}
      <nav className="bg-blue-600 text-white px-4 py-3 shadow-md flex justify-between items-center">
        <Link to="/" className="text-xl font-semibold">MyApp</Link>

        <div className="flex items-center gap-4">
          <Link to="/profile" className="hover:underline">
            Profile
          </Link>

          {loggedUser?.role === "admin" && (
            <Link to="/users" className="hover:underline">
              Manage Users
            </Link>
          )}

          <button
            onClick={handleLogout}
            className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-200"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* User List Content */}
      <div className="p-4">
        <h2 className="text-2xl font-semibold mb-4">All Users</h2>

        <input
          type="text"
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 border rounded w-full max-w-sm mb-4"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {users.map((user) => (
            <div
              key={user.id}
              className="p-4 bg-white rounded-xl shadow border flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                {user.profileImage && (
                  <img
                    src={user.profileImage}
                    alt={user.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                )}
                <div>
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <p className="text-sm">Role: {user.role}</p>
                </div>
              </div>

              {loggedUser?.role === "admin" && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(user)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
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
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-4 flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`px-3 py-1 rounded ${p === page
                ? "bg-blue-600 text-white"
                : "bg-gray-200"
                }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default UserList;
