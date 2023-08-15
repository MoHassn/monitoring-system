const cron = require('node-cron');
const axios = require('axios');
const https = require('https');
const urlPackage = require('url');
const emailService = require('./email.service');
const Response = require('../models/response.model');

// Store cron jobs
const activeCrons = {};

const startCronForUrlCheck = async (urlCheck) => {
  const {
    protocol,
    url,
    httpHeaders,
    authentication,
    timeout,
    interval,
    ignoreSSL,
    path,
    port,
    assert,
  } = urlCheck;

  const cronExpression = `*/${interval} * * * *`;
  console.log(cronExpression);

  activeCrons[urlCheck._id.toString()] = cron.schedule(cronExpression, async () => {
    const previousStatus = urlCheck.status;
    console.log("prev", previousStatus)
    try {

      const config = {
        headers: httpHeaders.reduce((acc, header) => {
          acc[header.key] = header.value;
          return acc;
        }, {}),
        auth: authentication,
        timeout: timeout * 1000,
        httpsAgent: ignoreSSL ? new https.Agent({ rejectUnauthorized: false }) : undefined,
      };

      const fullUrl = `${protocol.toLowerCase()}://${urlPackage.parse(url).hostname}${path ? path : ''}${port ? ':' + port : ''}`;

      const startTime = new Date();
      const response = await axios.get(fullUrl, config);
      const endTime = new Date();
      const responseTime = endTime - startTime;

      if (assert && assert.statusCode && response.status !== assert.statusCode) {
        throw new Error(`Status code assertion failed. Expected ${assert.statusCode}, got ${response.status}`);
      }

      const responseData = {
        urlCheckId: urlCheck._id,
        status: 'up', 
        responseTime: responseTime,
      };

      await Response.create(responseData);

      // Update the status in the urlCheck instance
      urlCheck.status = 'up'; 
      await urlCheck.save();

      // Notify user if status changed from down to up
      if (previousStatus === 'down') {
        emailService.sendStatusReportEmail(urlCheck)
      }

      console.log(`URL Check "${urlCheck.name}" status updated.`);
    } catch (error) {
      const responseData = {
        urlCheckId: urlCheck._id,
        status: 'down',
      };
      try{
        const savedResponse = await Response.create(responseData);

      } catch(e) {
        console.log("e", e)
      }

      console.log("here")

      // Update the status in the urlCheck instance
      urlCheck.status = 'down'; 
      await urlCheck.save();

      // Notify user if status changed from up to down
      if (previousStatus === 'up') {
        emailService.sendStatusReportEmail(urlCheck)
      }

      console.error(`URL Check "${urlCheck.name}" encountered an error:`, error);
    }
  });
};

const stopCronForUrlCheck = (urlCheckId) => {
  if (activeCrons[urlCheckId]) {
    activeCrons[urlCheckId].stop();
    delete activeCrons[urlCheckId];
  }
};


module.exports = {
  startCronForUrlCheck,
  stopCronForUrlCheck,
};