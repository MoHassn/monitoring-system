// routes/authRoutes.js
const express = require('express');
const authController = require('../controllers/auth.controller');
const userRouter = express.Router();

userRouter.post('/register', authController.register);

module.exports = userRouter;
