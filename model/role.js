const sequelize = require('../config/dbconfig');
const Sequelize = require('sequelize');
const { DataTypes } = Sequelize;
const role = sequelize.define('roles', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    permission: {
        type: DataTypes.ENUM("read", "write", "admin"),
        defaultValue: "read"
    },
    status: {
        type: DataTypes.TINYINT,
        defaultValue: 1
    },
    isDeleted: {
        type: DataTypes.TINYINT,
        defaultValue: 0
    }
}, { freezeTableName: true });

module.exports = role;