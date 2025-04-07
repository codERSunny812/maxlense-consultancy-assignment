const { User } = require("../models");
const redisClient = require("../config/redis");
const { Op } = require("sequelize");

const getAllUsers = async (req, res) => {
  console.log("get all user controller is called");
  try {
    const cacheKey = "users:all";
    const cachedUsers = await redisClient.get(cacheKey);

    if (cachedUsers) {
      return res.status(200).json({
        source: "cache",
        users: JSON.parse(cachedUsers),
      });
    }

    const users = await User.findAll({
      attributes: { exclude: ["password"] },
    });

    await redisClient.set(cacheKey, JSON.stringify(users), {
      EX: 60 * 5, // expires in 5 minutes
    });

    res.status(200).json({
      source: "database",
      users,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const keyword = req.query.keyword || "";
    const role = req.query.role; // optional role filter

    const offset = (page - 1) * limit;

    const whereClause = {
      ...(keyword && {
        [Op.or]: [
          { name: { [Op.like]: `%${keyword}%` } },
          { email: { [Op.like]: `%${keyword}%` } },
        ],
      }),
      ...(role && { role }),
    };

    const { count, rows: users } = await User.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      total: count,
      page,
      pages: Math.ceil(count / limit),
      users,
    });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const loggedInUserInfo = async (req, res) => {
  console.log(req.body);

  const { userId } = req.body;
  console.log("get user info controller is called");
  console.log("user id", userId);
  try {
    const user = await User.findByPk(userId, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const updateUserByAdmin = async (req, res) => {
  const { id } = req.params;
  const { name, email, role } = req.body;

  try {
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.role = role || user.role;

    await user.save();

    // Invalidate cached users (optional but good practice)
    await redisClient.del("users:all");

    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
const deleteUserByAdmin = async (req, res) => {
  console.log("delete user controller is called");
  console.log(req.params);
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.destroy();

    // Invalidate cached users (if using Redis)
    await redisClient.del("users:all");

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  getAllUsers,
  getUsers,
  getUserById,
  loggedInUserInfo,
  updateUserByAdmin,
  deleteUserByAdmin,
};
