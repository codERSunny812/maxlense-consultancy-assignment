require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const sequelize = require("./config/db");
const authRoutes = require("./routes/auth.routes");
const User = require("./models/user.model");
const userRouter = require("./routes/user.routes");

const app = express();

console.log(process.env.CLIENT_URL);

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRoutes);
app.use("/api/user", userRouter);

app.get("/", (req, res) => {
  res.send("Welcome to the home page");
});

sequelize
  .authenticate()
  .then(() => console.log("Connected to MySQL successfully."))
  .catch((err) => console.error("Unable to connect to MySQL:", err));

sequelize.sync({ alter: true }).then(() => {
  console.log("Models synchronized with DB.");
});

module.exports = app;
