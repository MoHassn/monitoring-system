const jwt = require('jsonwebtoken');
const userService = require('../services/user.service');
require('dotenv').config();

const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);

    const user = await userService.getUserById(decodedToken.userId);

    if (!user) {
      return res.status(401).json({ error: 'Authentication failed' });
    }

    if (!user.verified) {
      return res.status(403).json({ error: 'User not verified' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: 'Authentication failed' });
  }
};

module.exports = { authenticate };