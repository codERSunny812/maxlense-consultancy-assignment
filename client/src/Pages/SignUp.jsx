import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "../api/axios";

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
  

  const [imagePreview, setImagePreview] = useState(null);

  const onSubmit = async (data) => {
    console.log("form is submitted")
    console.log(data)
    try {

      console.log("form data",)
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });

      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      const res = await axios.post("/auth/register-user", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("response", res)

      alert(res.data.message || "Registered successfully!");
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
        <h2 className="text-2xl font-semibold text-center">Register</h2>

        <input
          type="text"
          placeholder="Name"
          {...register("name")}
          className="w-full p-2 border rounded"
        />
        <p className="text-red-500 text-sm">{errors.name?.message}</p>

        <input
          type="text"
          placeholder="Username"
          {...register("username")}
          className="w-full p-2 border rounded"
        />
        <p className="text-red-500 text-sm">{errors.username?.message}</p>

        <input
          type="email"
          placeholder="Email"
          {...register("email")}
          className="w-full p-2 border rounded"
        />
        <p className="text-red-500 text-sm">{errors.email?.message}</p>

        <input
          type="password"
          placeholder="Password"
          {...register("password")}
          className="w-full p-2 border rounded"
        />
        <p className="text-red-500 text-sm">{errors.password?.message}</p>

        <select {...register("role")} className="w-full p-2 border rounded">
          <option value="">Select Role</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <p className="text-red-500 text-sm">{errors.role?.message}</p>

        {/* ✅ Image Upload */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full p-2 border rounded"
        />
        {/* ✅ Image Preview */}
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Preview"
            className="w-20 h-20 rounded-full object-cover mx-auto mt-2"
          />
        )}

        <input
          type="hidden"
          {...register("profileImage")}
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          {isSubmitting ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default Register;
