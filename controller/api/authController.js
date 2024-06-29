const mongoose = require('mongoose');
const User = require('../../model/user'); // Assuming your user model path
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../../config/jwtConfig'); // Assuming your JWT configuration

const handleError = (err, res) => {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  };

// Register User 
module.exports.Register_User = async (req, res) => {
    try {
      const { city, email, name, password, phone, storeName} = req.body;
        console.log(req.body)
      if (!name || !email || !password || !storeName || !phone || !city) {
        return res.json({ success: false, message: 'Please Fill All The Fields', data: [] });
      }
  
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.json({ success: false, message: 'Email already exists', data: [] });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const user = new User({ name,username: email, email, password: hashedPassword, store_name: storeName, phone_no: phone, city });
      await user.save();
  
      const userData = { id: user._id, email: user.email };
      const token = jwt.sign(userData, config.secret, { expiresIn: '365d' });
  
      user.is_active = true;
      user.last_login = new Date();
      user.token = token;
      await user.save();
  
      return res.json({ success: true, message: "Welcome to Todify, Register Successfully...!", });
    } catch (err) {
      handleError(err, res);
    }
  };
  

// Login User 
module.exports.Login_User = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      const user = await User.findByCredentials(email, password)
      if (!user) {
        return res.json({ success: false, message: 'User not found', data: null });
      }
      console.log(user)
    //   const validPassword = await bcrypt.compare(password, user.password);
    //   if (!validPassword) {
    //     return res.json({ success: false, message: 'Invalid credentials', data: null });
    //   }
  
      const userData = { id: user._id, email: user.email };
      const token = jwt.sign(userData, config.secret, { expiresIn: '365d' });
  
      user.isActive = true;
      user.last_login = new Date();
      user.token = token;
      await user.save();
  
      const data = {
        token,
        id: user._id,
        store_name: user.store_name,
        name: user.name,
        email: user.email,
        city: user.city,
        phone_no: user.phone_no || '', // Assuming an optional contact field,
        user_type: user.user_type,
        provider: user.provider || '', // Assuming an optional provider field
      };
  
      return res.json({ success: true, message: "User Login Successfully", data });
    } catch (err) {
      handleError(err, res);
    }
  };
  