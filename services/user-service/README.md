# user-service

User APIs for the DevOps Microservices POC.

## Run

```bash
npm install
npm start
```

Default port: `3001` (override with `PORT`).

## Endpoints

| Method | Path | Description |
|---|---|---|
| GET | /health | Service health check |
| GET | /users | In-memory list of users |

## Example

```bash
curl http://localhost:3001/health
curl http://localhost:3001/users
```
