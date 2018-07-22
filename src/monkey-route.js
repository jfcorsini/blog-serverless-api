'use strict';

const express = require('express');
const AWS = require('aws-sdk');

AWS.config.update({
  region: 'eu-central-1',
});

const router = express.Router();

const formatError = (message, err) => ({
  message,
  error: err.message,
  stack: err.stack,
});

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
    },
  };

  return docClient.put(params).promise()
    .then(((data) => {
      res.json(data);
    }))
    .catch(err => res.status(404).json(formatError('Failed create', err)));
});

router.get('/:id', (req, res) => {
  const docClient = new AWS.DynamoDB.DocumentClient();

  const params = {
    TableName: 'monkey_sanctuary',
    Key: { id: parseInt(req.param('id'), 10) },
  };

  return docClient.get(params).promise()
    .then((data) => {
      if (!data.Item) {
        return res.status(404).json({ message: 'Id not found' });
      }

      return res.json(data.Item);
    })
    .catch(err => res.status(404).json(formatError('Failed to fetch id', err)));
});

router.put('/:id', (req, res) => {
  const docClient = new AWS.DynamoDB.DocumentClient();

  const { body: { extra } } = req;

  const params = {
    TableName: 'monkey_sanctuary',
    Key: { id: parseInt(req.param('id'), 10) },
    UpdateExpression: 'set extra = :extra',
    ExpressionAttributeValues: { ':extra': extra },
  };

  return docClient.update(params).promise()
    .then(() => res.status(204).json({}))
    .catch(err => res.status(404).json(formatError('Failed to update information', err)));
});

module.exports = router;
