const express = require('express');
const urlCheckController = require('../controllers/urlCheck.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const checkRouter = express.Router();

checkRouter.post('/', authMiddleware.authenticate, urlCheckController.createCheck);

module.exports = checkRouter;
