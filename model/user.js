const conn = require('../config/dbconfig');
var Sequelize = require('sequelize');
const { DataTypes } = Sequelize;
var bcrypt = require("bcryptjs");
const role = require('./role');

var users = conn.define("users", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    role_id: {
      type: DataTypes.INTEGER
    },
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      unique: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING
    },
    name: {
      type: DataTypes.STRING
    },
    profile_image: {
      type: DataTypes.STRING,
      allowNull: true
    },
    profile_image_thumb: {
      type: DataTypes.STRING,
      allowNull: true
    },
    is_approved: {
      type: DataTypes.TINYINT,
      defaultValue: 0
    },
    user_type: {
      type: DataTypes.ENUM,
      values: ['admin', 'user', 'seller'],
      defaultValue: 'user'
    },
    provider: {
      type: DataTypes.STRING(20),
      defaultValue: 'local'
    },
    token: {
      type: DataTypes.STRING,
      defaultValue: null
    },
    reset_token: {
      type: DataTypes.STRING,
      defaultValue: null
    },
    verify_token: {
      type: DataTypes.STRING,
      defaultValue: null
    },
    is_active: {
      type: Sequelize.TINYINT,
      defaultValue: 0
    },
    last_login: {
      type: Sequelize.DATE,
      allowNull: true,
      get() {
        return moment(this.getDataValue('last_login')).fromNow();
      }
    },
    status: {
      type: DataTypes.TINYINT,
      defaultValue: 1
    },
    isDeleted: {
      type: DataTypes.TINYINT,
      defaultValue: 0
    },
    createdAt: {
      type: DataTypes.DATE,
      get() {
        return moment(this.getDataValue('createdAt')).fromNow();
      }
    },
    updatedAt: {
      type: DataTypes.DATE,
      get() {
        return moment(this.getDataValue('updatedAt')).fromNow();
      }
    }
  }, { freezeTableName: true });
  
// PASSWORD HASH
users.beforeSave((user) => {
    if (user.changed('password')) {
        user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);
    }

});

// // PASSWORD HASH
users.beforeUpdate((customer) => {
    if (customer.changed('password')) {
        customer.password = bcrypt.hashSync(customer.password, bcrypt.genSaltSync(10), null);
    }
})
// CAMPARE PASSWORD DURING LOGIN
users.prototype.comparePassword = function (password, cb) {
    bcrypt.compare(password, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);

    });
};

users.belongsTo(role, { foreignKey: 'role_id', as: 'roles' });

module.exports = users;