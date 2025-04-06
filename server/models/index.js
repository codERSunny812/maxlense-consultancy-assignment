const sequelize = require('../config/db.js');
const User = require('./user.model.js');

const db = {};
db.sequelize = sequelize;
db.User = User;

module.exports = db;
