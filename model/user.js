const mongoose = require('mongoose')
const bcrypt = require('bcryptjs'); // Assuming you're using bcrypt for password hashing

const userSchema = new mongoose.Schema({
  id: {
    type: Number, // Assuming you want to keep the ID as a Number
    autoIncrement: true,  // Use an auto-incrementing plugin if needed
    primaryKey: true,
    allowNull: false
  },
  role_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role' // Reference the corresponding Role model
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    select: false // Don't include password in queries by default
  },
  email: {
    type: String,
    unique: true // Can be optional depending on your requirements
  },
  name: {
    type: String,
    allowNull: false
  },
  store_name: {
    type: String,
    allowNull: true
  },
  city: {
    type: String,
    allowNull: true
  },
  phone_no: {
    type: String,
    allowNull: true
  },
  profile_image: {
    type: String,
    allowNull: true
  },
  profile_image_thumb: {
    type: String,
    allowNull: true
  },
  is_approved: {
    type: Boolean,
    default: false
  },
  user_type: {
    type: String,
    enum: ['admin', 'user', 'seller'],
    default: 'user'
  },
  provider: {
    type: String,
    default: 'local'
  },
  token: {
    type: String,
    default: null
  },
  reset_token: {
    type: String,
    default: null
  },
  verify_token: {
    type: String,
    default: null
  },
  is_active: {
    type: Boolean,
    default: false
  },
  last_login: {
    type: Date,
    default: Date.now
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

// Pre-save hook for password hashing (assuming bcrypt)
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});
/// for logging in///
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email }).select("+password")
    console.log(user, email)
  if (!user) {
    throw new Error('User not found')
  }
  // console.log(password, user.password)
  // const isMatch = await bcrypt.compare(password, user.password)
  // if (!isMatch) {
  //   throw new Error('unable to login')
  // }
  return user
}


const User = mongoose.model('User', userSchema)

module.exports = User
