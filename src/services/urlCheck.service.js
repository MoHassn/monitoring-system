const UrlCheck = require('../models/urlCheck.model');

const createCheck = async (checkData) => {
  try {
    const newCheck = new UrlCheck(checkData);
    await newCheck.save();
    return newCheck;
  } catch (error) {
    throw error;
  }
};

module.exports = { createCheck };
