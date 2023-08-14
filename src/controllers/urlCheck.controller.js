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


const createCheck = async (req, res) => {
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

module.exports = { createCheck };
