const test = require('node:test');
const assert = require('node:assert/strict');
const app = require('./app');

let server;
let baseUrl;

test.before(() => {
  server = app.listen(0);
  const { port } = server.address();
  baseUrl = `http://127.0.0.1:${port}`;
});

test.after(() => {
  server.close();
});

test('GET /health returns 200 with service status ok', async () => {
  const res = await fetch(`${baseUrl}/health`);
  assert.equal(res.status, 200);

  const body = await res.json();
  assert.equal(body.service, 'product-service');
  assert.equal(body.status, 'ok');
});

test('GET /metrics returns Prometheus-format application metrics', async () => {
  const res = await fetch(`${baseUrl}/metrics`);
  assert.equal(res.status, 200);
  assert.match(res.headers.get('content-type'), /text\/plain/);

  const body = await res.text();
  assert.match(body, /# TYPE http_requests_total counter/);
  assert.match(body, /# TYPE http_request_duration_seconds histogram/);
});
