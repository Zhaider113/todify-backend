const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  id: { // Assuming you want to keep the ID as a Number
    type: Number,
    autoIncrement: true,  // Use an auto-incrementing plugin if needed
    primaryKey: true,
    allowNull: false
  },
  title: {
    type: String,
    required: true,
    maxlength: 255 // Set a maximum length for security
  },
  permission: {
    type: String,
    enum: ['read', 'write', 'admin'],
    default: 'read'
  },
  status: {
    type: Number,
    default: 1
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Role', roleSchema);
