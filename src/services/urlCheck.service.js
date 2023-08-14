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


const getAllChecks = async () => {
  try {
    const urlChecks = await UrlCheck.find();
    return urlChecks;
  } catch (error) {
    throw error;
  }
};

const getCheckById = async (checkId) => {
  try {
    const check = await UrlCheck.findById(checkId);
    return check;
  } catch (error) {
    throw error;
  }
};


module.exports = { createCheck,getAllChecks, getCheckById };
