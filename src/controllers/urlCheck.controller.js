const urlCheckService = require('../services/urlCheck.service');

const Joi = require('joi');

const createUrlCheckSchema = Joi.object({
  name: Joi.string().required(),
  url: Joi.string().required(),
  protocol: Joi.string().valid('HTTP', 'HTTPS', 'TCP').required(),
  path: Joi.string(),
  port: Joi.number().integer(),
  webhook: Joi.string(),
  timeout: Joi.number().integer().default(5),
  interval: Joi.number().integer().default(600),
  threshold: Joi.number().integer().default(1),
  authentication: Joi.object({
    username: Joi.string(),
    password: Joi.string(),
  }),
  httpHeaders: Joi.array().items(Joi.object({
    key: Joi.string().required(),
    value: Joi.string().required(),
  })),
  assert: Joi.object({
    statusCode: Joi.number().integer(),
  }),
  tags: Joi.array().items(Joi.string()),
  ignoreSSL: Joi.boolean().default(false),
});

const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
});


const createURLCheck = async (req, res) => {
  try {
    const checkData = req.body;
    
    const { error, value } = createUrlCheckSchema.validate(checkData);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    value.userId = req.user._id; // Add the user's ID to the check data

    const newCheck = await urlCheckService.createCheck(value);
    res.status(201).json(newCheck);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getAllURLChecks = async (req, res) => {
  try {
    const userId = req.user.id;

    const { value: paginationParams, error } = paginationSchema.validate(req.query);
    if (error) {
      return res.status(400).json({ errors: error.details });
    }

    const { page, limit } = paginationParams;

    const urlChecks = await urlCheckService.listAllChecks(userId, page, limit);

    res.status(200).json(urlChecks);
  } catch (error) {
    console.error('Error getting URL checks:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateURLCheck = async (req, res) => {
  try {
    const userId = req.user.id;
    const urlCheckId = req.params.checkId;

    const { value: data, error } = createUrlCheckSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ errors: error.details });
    }

    const updatedURLCheck = await urlCheckService.updateCheck(userId, urlCheckId, data);

    res.status(200).json(updatedURLCheck);
  } catch (error) {
    console.error('Error updating URL check:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteURLCheck = async (req, res) => {
  try {
    const userId = req.user.id;
    const urlCheckId = req.params.checkId;

    const urlCheck = await urlCheckService.getCheckById(urlCheckId);
    if (!urlCheck) {
      return res.status(404).json({ error: 'URL check not found' });
    }
    await urlCheckService.deleteCheck(userId, urlCheckId);

    res.status(200).json({ message: 'URL check deleted successfully' });
  } catch (error) {
    console.error('Error deleting URL check:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
    

module.exports = { createURLCheck, getAllURLChecks, updateURLCheck, deleteURLCheck };
