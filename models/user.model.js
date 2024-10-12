// models/User.js

const mongoose = require('mongoose');

// Define the User schema
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const Users = mongoose.model('Users', UserSchema);

module.exports = Users;
