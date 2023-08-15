require("dotenv").config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const hashPassword = async (password) => {
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

const comparePassword = async (password, hash) => {
  const result = await bcrypt.compare(password, hash);
  return result;
};

const generateJWT = (userId) => {
  const secretKey = process.env.SECRET_KEY;
  const token = jwt.sign({ userId }, secretKey);
  return token;
};

const generateVerificationToken = () => {
  const randomBytes = crypto.randomBytes(32);
  return randomBytes.toString('hex');
};

const verifyPassword = async (password, hashedPassword) => {
  console.log(password, hashedPassword)
  try {
    const isValid = await bcrypt.compare(password, hashedPassword);
    return isValid;
  } catch (error) {
    throw error;
  }
};


module.exports = { hashPassword, generateJWT, comparePassword, generateVerificationToken, verifyPassword };
