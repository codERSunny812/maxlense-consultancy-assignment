// routes/userRoutes.js
const express = require("express");
const { protected, authorizedRole } = require("../middleware/auth.middleware");
const {
  getAllUsers,
  getUsers,
  getUserById,
  loggedInUserInfo,
  updateUserByAdmin,
  deleteUserByAdmin,
} = require("../controller/user.controller");
const userRouter = express.Router();

// route to fetch all users
userRouter.get("/", protected, getAllUsers);

// route to fetch all users with pagination
userRouter.get("/all", protected, getUsers);
// route to fetch a single user by id
userRouter.get("/:id", protected, getUserById);
// route to fetch logged in user info
userRouter.post("/get-profile", protected, loggedInUserInfo);
// route to update user by admin
userRouter.put(
  "/admin/edit-user/:id",
  protected,
  authorizedRole("admin"),
  updateUserByAdmin
);
// route to delete user by admin
userRouter.delete(
  "/admin/delete-user/:id",
  protected,
  authorizedRole("admin"),
  deleteUserByAdmin
);

module.exports = userRouter;
