const reportService = require('../services/report.service');
const urlCheckService = require('../services/urlCheck.service');

const generateReport = async (req, res) => {  
  try {
    const userId = req.user.id;
    const urlCheckId = req.params.checkId;

    const urlCheck = await urlCheckService.getCheckById(urlCheckId);

    if (!urlCheck) {
      return res.status(404).json({ error: 'URL check not found' });
    }

    if (urlCheck.userId.toString() !== userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    
    const report = await reportService.generateReport(urlCheckId);
    res.status(200).json(report);
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


module.exports = { generateReport };