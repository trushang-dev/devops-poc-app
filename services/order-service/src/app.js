const express = require('express');

const app = express();

const SERVICE_NAME = 'order-service';

const orders = [
  { id: 1, userId: 1, productId: 2, quantity: 1, status: 'shipped' },
  { id: 2, userId: 2, productId: 1, quantity: 2, status: 'pending' },
  { id: 3, userId: 3, productId: 3, quantity: 1, status: 'delivered' },
];

app.get('/health', (req, res) => {
  res.status(200).json({
    service: SERVICE_NAME,
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

app.get('/orders', (req, res) => {
  res.status(200).json(orders);
});

app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.originalUrl} does not exist`,
  });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'An unexpected error occurred',
  });
});

module.exports = app;
