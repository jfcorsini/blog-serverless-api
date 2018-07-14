'use strict';

const express = require('express');
const cors = require('cors');
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');

const app = express();
app.use(cors());
app.use(awsServerlessExpressMiddleware.eventContext());

app.use('/health', (req, res) => {
  res.send('OK');
});

module.exports = app;
