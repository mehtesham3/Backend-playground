# 🐇 Day 23 – Message Queues (RabbitMQ Basics)

## 📌 Core Concepts

- **Why Message Queues?**
  - Decoupling between services
  - Asynchronous processing
  - Reliability & scalability
- **Pub/Sub Model**
  - Publisher → Broker → Consumer(s)
  - Example: User Service publishes → Email Service consumes
- **RabbitMQ vs Kafka**
  - RabbitMQ → good for task queues, notifications
  - Kafka → good for event streaming, analytics

---

## 🛠 Setup RabbitMQ

### Option 1: Docker (Recommended)

```bash
docker run -d --name rabbitmq \
  -p 5672:5672 \
  -p 15672:15672 \
  rabbitmq:3-management
```
