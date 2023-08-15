const UrlCheck = require('../models/urlCheck.model');
const cronService = require('./cron.service')

const createCheck = async (checkData) => {
  try {
    const newCheck = new UrlCheck(checkData);
    await newCheck.save();
    cronService.startCronForUrlCheck(newCheck);
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

const listAllChecks = async(userId, page, limit) => {
  try{
    const skip = (page - 1) * limit;
    return UrlCheck.find({ userId }).skip(skip).limit(limit);
  } catch(error) {
    throw error;
  }
}

const updateCheck = async(userId, urlCheckId, data) => {
  try{
    const updatedURLCheck = await UrlCheck.findOneAndUpdate(
      { _id: urlCheckId, userId },
      data,
      { new: true }
    );
    if(updatedURLCheck) {
      cronService.stopCronForUrlCheck(urlCheckId)
      cronService.startCronForUrlCheck(updatedURLCheck)
    }
    return updatedURLCheck;
  } catch (error) {
    throw error;
  }
}

const deleteCheck = async (userId, urlCheckId) => {
  try {
    await UrlCheck.findOneAndDelete({ _id: urlCheckId, userId });
    cronService.stopCronForUrlCheck(urlCheckId)
  } catch (error) {
    throw error;
  }
};

module.exports = { createCheck, getAllChecks, getCheckById, listAllChecks, updateCheck, deleteCheck };
