'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');
const monkeyRoute = require('./monkey-route');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(awsServerlessExpressMiddleware.eventContext());

app.use('/health', (req, res) => {
  res.send('OK');
});

app.use('/monkeys', monkeyRoute);

module.exports = app;
