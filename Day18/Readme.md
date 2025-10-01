# Docker Basics – Day 18 Learning Project

## Project Overview

This repository documents my Day 18 learning journey on Docker and backend development. The project demonstrates how to containerize a Node.js/Express API with MongoDB using Docker and Docker Compose. The goal is to understand containerization, create reproducible environments, and simplify running backend applications.

---

## What I Learned (Theory)

During this project, I explored several core Docker concepts:

- **Containerization vs Virtualization:** Containers share the host OS kernel, making them lightweight and faster than full virtual machines.
- **Docker Images:** Read-only templates used to create containers; define your application environment and dependencies.
- **Docker Containers:** Running instances of Docker images, isolated and portable across environments.
- **Dockerfiles:** Scripts defining how to build Docker images, including app code, dependencies, and configuration.
- **Benefits of Docker:**
  - **“Works on my machine” solved:** Containers ensure consistent environments across machines.
  - **Isolation:** Each container runs independently with its own dependencies.
  - **Portability:** Containers can run anywhere Docker is installed.

---

## Tech Stack

- **Docker & Docker Compose** – Containerization and orchestration
- **Node.js & Express.js** – Backend API
- **MongoDB** – Database

---

## Project Structure

Middelware/
├─ auth.js
├─ loggerMiddelware.js
├─ Routes/
│ ├─ Blog.js
│ └─ User.js
├─ logs/
│ ├─ combined.log
│ └─ error.log
├─ .dockerignore
├─ .docker-compose.yml
├─ .Dockerfile
├─ .index.js
├─ .logger.js
├─ package-lock.json
├─ package.json
├─ Schema.js
└─ README.md

---

## Core Docker Commands

```bash
# Build a Docker image
docker build -t blog-api .

# Run the API container
docker run -d -p 8080:8080 --name blog-api \
  -v ${PWD}/logs:/app/logs \
  --env-file .env blog-api

# List running containers
docker ps

# Stop a container
docker stop blog-api

# Remove a container
docker rm blog-api

# Start services with Docker Compose
docker-compose up -d

# Stop services with Docker Compose
docker-compose down
```
