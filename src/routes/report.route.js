// routes/authRoutes.js
const express = require('express');
const reportController = require('../controllers/report.controller');;
const authMiddleware = require('../middlewares/auth.middleware');

const reportRouter = express.Router();

reportRouter.get('/:checkId',authMiddleware.authenticate ,reportController.generateReport);

module.exports = reportRouter;
