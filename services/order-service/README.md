# order-service

Order APIs for the DevOps Microservices POC.

## Run

```bash
npm install
npm start
```

Default port: `3003` (override with `PORT`).

## Endpoints

| Method | Path | Description |
|---|---|---|
| GET | /health | Service health check |
| GET | /orders | In-memory list of orders |
| GET | /metrics | Prometheus metrics |

## Example

```bash
curl http://localhost:3003/health
curl http://localhost:3003/orders
curl http://localhost:3003/metrics
```
