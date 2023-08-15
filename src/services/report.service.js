const { ObjectId } = require('mongoose').Types;
const Response = require('../models/response.model');
const UrlCheck = require('../models/urlCheck.model');

const generateReport = async (urlCheckId) => {
  try {
    const urlCheck = await UrlCheck.findById(urlCheckId);

    const report = await Response.aggregate([
      {
        $match: { urlCheckId: new ObjectId(urlCheckId) },
      },
      {
        $group: {
          _id: '$status', 
          responseTimes: { $push: '$responseTime' }, 
          count : { $sum: 1 },
        },
      },
      {
        $addFields: {
          averageResponseTime: { $avg: '$responseTimes' },},
      }
    ]);
    const upDocument = report.find((doc) => doc._id === 'up');
    const downDocument = report.find((doc) => doc._id === 'down');

    const result = {
      status: urlCheck.status,
      availability: (upDocument.count / (upDocument.count + downDocument.count))* 100,
      outages: downDocument.count,
      downTime: downDocument.count * urlCheck.interval,
      upTime: upDocument.count * urlCheck.interval,
      averageResponseTime: upDocument.averageResponseTime,

    }

    return result;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  generateReport,
};
