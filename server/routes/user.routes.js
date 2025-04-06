// routes/userRoutes.js
const express = require("express");
// const getAllUsers = require("../controller/user.controller");
const { protected, authorizedRole } = require("../middleware/auth.middleware");
const { getAllUsers, getUsers } = require("../controller/user.controller");
const userRouter = express.Router();


userRouter.get("/",protected,authorizedRole("admin"),getAllUsers);

userRouter.get(
    "/all",
    protected,
    authorizedRole("admin"),
    getUsers
);

module.exports = userRouter;
