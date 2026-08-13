# DevOps POC — Application

This repository contains the Node.js application source code for the local DevOps Microservices POC.

## Responsibility

This repository contains:

- Node.js microservices
- Application tests
- Dockerfiles
- GitHub Actions CI workflows
- Application documentation

Kubernetes and GitOps configuration belongs to the `devops-poc-gitops` repository.

## M1 — Application

M1 delivers three independent, runnable Node.js/Express services under `services/`. Each service uses an in-memory data set only — no database, authentication, or external dependency is required.

```text
devops-poc-app/
├── services/
│   ├── user-service/
│   ├── product-service/
│   └── order-service/
├── README.md
└── .gitignore
```

## Services

| Service | Port | Purpose | Functional Endpoint |
|---|---:|---|---|
| user-service | 3001 | User APIs | `GET /users` |
| product-service | 3002 | Product APIs | `GET /products` |
| order-service | 3003 | Order APIs | `GET /orders` |

Each service exposes:

```text
GET /health
```

returning HTTP 200 with the service name, status, and timestamp. Unknown routes return a JSON 404; unexpected errors return a JSON 500.

Each service will eventually expose Prometheus metrics through:

```text
GET /metrics
```

### Install dependencies

```bash
cd services/user-service && npm install
cd services/product-service && npm install
cd services/order-service && npm install
```

### Run a service

```bash
cd services/user-service && npm start      # or: npm run dev
```

`PORT` is configurable via environment variable and defaults to the port listed above.

### Example curl commands

```bash
curl http://localhost:3001/health
curl http://localhost:3001/users

curl http://localhost:3002/health
curl http://localhost:3002/products

curl http://localhost:3003/health
curl http://localhost:3003/orders
```

### M1 scope

M1 covers only the Node.js application layer. The following are intentionally **not** implemented yet and belong to later milestones:

- Docker / docker-compose
- Kubernetes manifests
- Helm charts
- Argo CD
- GitHub Actions / CI/CD
- Trivy scanning
- Prometheus / Grafana
- PostgreSQL or any other database

## Git Workflow

```text
feature/*
    ↓
develop
    ↓
release/*
    ↓
main
```

This repository uses a simple Git branching model for development and releases:

- feature/*: short-lived branches where new features are developed (example: `feature/add-user-profile`).
- develop: integration branch where feature branches are merged and tested together.
- release/*: stabilization branches created from `develop` for preparing a release (example: `release/1.0.0`).
- main: production-ready branch representing released code.

Workflow summary:

feature/* -> develop -> release/* -> main

`main` = production, `develop` = integration, `feature/*` = development work, `release/*` = release preparation.

## CI Workflow

The eventual GitHub Actions pipeline will follow:

```text
Git Push / Pull Request
        ↓
Tests
        ↓
Trivy Scan
        ↓
Docker Build
        ↓
Trivy Image Scan
        ↓
Push Image to Docker Hub
        ↓
Update GitOps Repository
```

GitHub Actions must not directly deploy to Kubernetes.

## Docker

Each service will have a versioned image:

```text
docker.io/<username>/user-service:v1.0.0
docker.io/<username>/product-service:v1.0.0
docker.io/<username>/order-service:v1.0.0
```

Avoid using `latest` as the GitOps deployment version.

### Build images

From the repository root (`devops-poc-app`) you can build images individually:

```bash
docker build -t devops-poc/user-service:1.0.0 ./services/user-service
docker build -t devops-poc/product-service:1.0.0 ./services/product-service
docker build -t devops-poc/order-service:1.0.0 ./services/order-service
```

Or use Docker Compose to build and start all services:

```bash
docker compose up --build -d
```

### Run containers

Example (individual):

```bash
docker run --name devops-poc-user-service -p 3001:3001 -e PORT=3001 devops-poc/user-service:1.0.0
```

With Docker Compose the services are available on ports `3001`, `3002`, `3003`.

### Test services

```bash
curl http://localhost:3001/health
curl http://localhost:3001/users

curl http://localhost:3002/health
curl http://localhost:3002/products

curl http://localhost:3003/health
curl http://localhost:3003/orders

curl http://localhost:3001/version
```

### Stop

```bash
docker compose down
```

Notes:
- Images used during M3 are local only and not pushed to Docker Hub.
- `latest` is intentionally not used as the primary release tag; versioned tags (e.g. `1.0.0`) are used.


## Development Rules

- Keep application logic simple.
- Do not hardcode secrets.
- Use environment variables for configuration.
- Do not introduce unnecessary technologies.
- Follow `../PROJECT_SCOPE.md`.
- Follow `../CLAUDE OPERATING RULES.md`.

## Repository Relationship

```text
devops-poc-app
      ↓
GitHub Actions
      ↓
Docker Hub
      ↓
devops-poc-gitops
      ↓
Argo CD
      ↓
Kubernetes
```