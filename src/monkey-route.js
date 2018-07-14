'use strict';

const express = require('express');
const AWS = require('aws-sdk');

AWS.config.update({
  region: 'eu-central-1',
});

const router = express.Router();

router.post('/', (req, res) => {
  const docClient = new AWS.DynamoDB.DocumentClient();

  const { body } = req;
  const now = new Date();

  const params = {
    TableName: 'monkey_sanctuary',
    Item: {
      id: parseInt(body.id, 10),
      specie: body.specie,
      arrival_date: now.toISOString(),
      name: body.name,
      color: body.color,
    },
  };

  return docClient.put(params).promise()
    .then(((data) => {
      res.json(data);
    }))
    .catch((err) => {
      res.json({
        message: 'Failed to create',
        error: err.message,
        stack: err.stack,
      });
    });
});

module.exports = router;
