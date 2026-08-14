const express = require('express');
const client = require('prom-client');

const app = express();

const SERVICE_NAME = 'order-service';

const register = new client.Registry();
client.collectDefaultMetrics({ register });

const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests received',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register],
});

app.use((req, res, next) => {
  res.on('finish', () => {
    httpRequestsTotal.inc({
      method: req.method,
      route: req.path,
      status_code: res.statusCode,
    });
  });
  next();
});

const orders = [
  { id: 1, userId: 1, productId: 2, quantity: 1, status: 'shipped' },
  { id: 2, userId: 2, productId: 1, quantity: 2, status: 'pending' },
  { id: 3, userId: 3, productId: 3, quantity: 1, status: 'delivered' },
];

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

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
