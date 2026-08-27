const express = require('express');
const client = require('prom-client');

const app = express();

const SERVICE_NAME = 'user-service';

const register = new client.Registry();
client.collectDefaultMetrics({ register });

const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests received',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register],
});

// Buckets are seconds, chosen to bracket the response times actually seen
// under ApacheBench load testing (mean ~50ms, p99 in the low hundreds of ms).
const httpRequestDurationSeconds = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request duration in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.01, 0.05, 0.1, 0.3, 0.5, 1, 2, 5],
  registers: [register],
});

app.use((req, res, next) => {
  const startTime = process.hrtime.bigint();
  res.on('finish', () => {
    const labels = {
      method: req.method,
      route: req.path,
      status_code: res.statusCode,
    };
    httpRequestsTotal.inc(labels);
    const durationSeconds = Number(process.hrtime.bigint() - startTime) / 1e9;
    httpRequestDurationSeconds.observe(labels, durationSeconds);
  });
  next();
});

const users = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com' },
  { id: 3, name: 'Carol Williams', email: 'carol@example.com' },
  { id: 4, name: 'Trushang Suthar', email: 'trushang.dev@gmail.com' },
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

app.get('/users', (req, res) => {
  res.status(200).json(users);
});

app.get('/version', (req, res) => {
  res.status(200).json({
    service: SERVICE_NAME,
    version: '1.0.1',
  });
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
