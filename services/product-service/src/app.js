const express = require('express');
const client = require('prom-client');

const app = express();

const SERVICE_NAME = 'product-service';

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

const products = [
  { id: 1, name: 'Wireless Mouse', price: 19.99 },
  { id: 2, name: 'Mechanical Keyboard', price: 59.99 },
  { id: 3, name: '27-inch Monitor', price: 249.99 },
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
