const express = require('express');

const app = express();

const SERVICE_NAME = 'product-service';

const products = [
  { id: 1, name: 'Wireless Mouse', price: 19.99 },
  { id: 2, name: 'Mechanical Keyboard', price: 59.99 },
  { id: 3, name: '27-inch Monitor', price: 249.99 },
];

app.get('/health', (req, res) => {
  res.status(200).json({
    service: SERVICE_NAME,
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

app.get('/products', (req, res) => {
  res.status(200).json(products);
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
