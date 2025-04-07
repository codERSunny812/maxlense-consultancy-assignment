import React from "react";
import { useNavigate, Link } from "react-router-dom";

const Navbar = ({ loggedUser }) => {
  const navigate = useNavigate();


  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };
  return (
    <div>
      <nav className="bg-gray-600 text-white px-4 py-3 shadow-md flex justify-between items-center">
        <Link to="/home" className="text-xl font-semibold">
          MyApp
        </Link>

        <div className="flex items-center gap-4">
          {window.location.pathname !== "/profile" && (
            <Link to="/profile" className="hover:underline">
              <img
                src={loggedUser?.profileImage}
                alt=""
                className="h-12 w-13 rounded-full"
              />
            </Link>
          )}

          {window.location.pathname == "/profile" && (
            <button
              onClick={handleLogout}
              className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-200"
            >
              Logout
            </button>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
