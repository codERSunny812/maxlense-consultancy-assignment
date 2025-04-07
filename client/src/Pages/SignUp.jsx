import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  username: yup.string().required("Username is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(6).required("Password is required"),
  role: yup.string().oneOf(["user", "admin"]).required("Role is required"),
});

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const navigate = useNavigate();

  const [imagePreview, setImagePreview] = useState(null);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const res = await axios.post("/auth/register-user", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert(res.data.message || "Registered successfully!");
      navigate("/login");

    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setValue("profileImage", file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded-2xl shadow-md w-full max-w-md space-y-4"
        encType="multipart/form-data"
      >
        <h2 className="text-2xl font-semibold text-center text-gray-800">
          Register
        </h2>

        <div>
          <input
            type="text"
            placeholder="Name"
            {...register("name")}
            className="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
          />
          <p className="text-red-500 text-sm mt-1">{errors.name?.message}</p>
        </div>

        <div>
          <input
            type="text"
            placeholder="Username"
            {...register("username")}
            className="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
          />
          <p className="text-red-500 text-sm mt-1">{errors.username?.message}</p>
        </div>

        <div>
          <input
            type="email"
            placeholder="Email"
            {...register("email")}
            className="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
          />
          <p className="text-red-500 text-sm mt-1">{errors.email?.message}</p>
        </div>

        <div>
          <input
            type="password"
            placeholder="Password"
            {...register("password")}
            className="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
          />
          <p className="text-red-500 text-sm mt-1">{errors.password?.message}</p>
        </div>

        <div>
          <select
            {...register("role")}
            className="w-full p-2 border rounded bg-white focus:outline-none focus:ring focus:border-blue-400"
          >
            <option value="">Select Role</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <p className="text-red-500 text-sm mt-1">{errors.role?.message}</p>
        </div>

        <div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-2 border rounded bg-white"
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 rounded-full object-cover mx-auto mt-2"
            />
          )}
          <input type="hidden" {...register("profileImage")} />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition-colors"
        >
          {isSubmitting ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default Register;
