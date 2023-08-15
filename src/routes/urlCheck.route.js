const express = require('express');
const urlCheckController = require('../controllers/urlCheck.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const checkRouter = express.Router();

checkRouter.post('/', authMiddleware.authenticate, urlCheckController.createURLCheck);
checkRouter.get('/', authMiddleware.authenticate, urlCheckController.getAllURLChecks);
checkRouter.put('/:checkId', authMiddleware.authenticate, urlCheckController.updateURLCheck);
checkRouter.delete('/:checkId', authMiddleware.authenticate, urlCheckController.deleteURLCheck);

module.exports = checkRouter;
