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

## Services

| Service | Port | Purpose |
|---|---:|---|
| user-service | 3001 | User APIs |
| product-service | 3002 | Product APIs |
| order-service | 3003 | Order APIs |

Each service will expose:

```text
GET /health
```

and will eventually expose Prometheus metrics through:

```text
GET /metrics
```

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