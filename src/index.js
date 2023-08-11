require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectToDB = require('./db');

const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello From Monitoring System');
});

app.listen(port, async () => {
  await connectToDB();

  console.log(`app is listening on http://localhost:${port}`);
});
