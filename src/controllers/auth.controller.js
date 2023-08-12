const userService = require('../services/user.service');
const emailService = require('../services/email.service');
const { generateJWT } = require('../helpers/authHelper');
const Joi = require('joi');

const register = async (req, res) => {
  try {
    const schema = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const user = await userService.createUser(req.body);
    const token = generateJWT(user._id);

    await emailService.sendVerificationEmail(user.email, user.verificationToken);


    res.status(201).json({ message: 'User registered successfully', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const verificationToken = req.params.token;
    const user = await userService.getUserByVerificationToken(verificationToken);

    if (!user) {
      return res.status(404).json({ error: 'Invalid verification token' });
    }

    await userService.verifyUser(user._id);

    res.status(200).json({ message: 'User verified successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { register, verifyEmail };

