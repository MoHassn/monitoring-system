require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectToDB = require('./db');
const userRouter = require('./routes/user.route');
const urlCheckRouter = require('./routes/urlCheck.route');
// const { startAllCrons } = require('./services/cron.service');
const urlCheckService = require('./services/urlCheck.service');
const cronService = require('./services/cron.service');

const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());
app.use(cors());
app.use('/users', userRouter)
app.use('/checks', urlCheckRouter)

app.get('/', (req, res) => {
  res.send('Hello From Monitoring System');
});

app.listen(port, async () => {
  await connectToDB();

  // startAllCrons
  (async() => {
      try {
        const allUrlChecks = await urlCheckService.getAllChecks(); // Fetch all URL checks from the database
    
        allUrlChecks.forEach((urlCheck) => {
          cronService.startCronForUrlCheck(urlCheck); // Start a cron for each URL check
          console.log(`Cron started for URL check "${urlCheck.name}"`);
        });
    
        console.log('All cron jobs started.');
      } catch (error) {
        console.error('Error starting cron jobs:', error);
      }
  })();
  console.log(`app is listening on http://localhost:${port}`);
});
