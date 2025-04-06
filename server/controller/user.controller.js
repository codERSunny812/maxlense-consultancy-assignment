// controllers/user.controller.js
const { User } = require("../models");
const redisClient = require("../config/redis");

const getAllUsers = async (req, res) => {
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


module.exports={getAllUsers,getUsers}
