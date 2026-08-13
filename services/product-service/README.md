# product-service

Product APIs for the DevOps Microservices POC.

## Run

```bash
npm install
npm start
```

Default port: `3002` (override with `PORT`).

## Endpoints

| Method | Path | Description |
|---|---|---|
| GET | /health | Service health check |
| GET | /products | In-memory list of products |

## Example

```bash
curl http://localhost:3002/health
curl http://localhost:3002/products
```
