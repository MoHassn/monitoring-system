const User = require('../models/user.model');
const { hashPassword } = require('../helpers/authHelper');

const createUser = async (userData) => {
  try {
    // Check if a user with the same email already exists
    const existingUser = await User.findOne({ email: userData.email });

    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const hashedPassword = await hashPassword(userData.password);

    const user = new User({
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
    });

    await user.save();

    return user;
  } catch (error) {
    throw error;
  }
};

module.exports = { createUser };