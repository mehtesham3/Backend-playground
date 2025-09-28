# 📅 Day 24 – Event-Driven Architecture (Mini E-Commerce Async Order Processing)

## 📌 Core Topic Focus

- Event-driven design
- Event buses & brokers
- Designing loosely coupled services

---

## 🔹 What is Event-Driven Architecture?

Event-Driven Architecture (EDA) is a design pattern where services **communicate via events** instead of direct API calls.  
👉 A service emits an event when something happens, and other services **listen and react** asynchronously.

**Key Components:**

- **Event** → A fact that something happened (`OrderPlaced`, `PaymentConfirmed`).
- **Producer** → Emits events (e.g., Order Service).
- **Consumer** → Listens & reacts to events (e.g., Notification Service).
- **Event Bus/Broker** → Middleware that transports events (RabbitMQ, Kafka, SNS/SQS).

---

## 🔹 Why Use EDA?

- ✅ **Scalability** – Services scale independently.
- ✅ **Resilience** – Events stay in queue if consumer is down.
- ✅ **Loose Coupling** – Producers don’t know who consumes the event.
- ✅ **Flexibility** – New consumers can be added without changing producers.

---

## 🏗️ Mini E-Commerce Async Flow

1. **Order Service** → User places order → emits `OrderPlaced`.
2. **Payment Service** → Listens for `OrderPlaced`, processes payment → emits `PaymentConfirmed`.
3. **Inventory Service** → Listens for `PaymentConfirmed`, reduces stock.
4. **Notification Service** → Listens to multiple events → sends confirmation emails/alerts.

👉 All communication happens via **RabbitMQ** events.

---

## 📄 Order Service – `/order` Route (Producer)

### Endpoint

```http
POST /order
Content-Type: application/json
```

### Docker

```
docker run -it --rm --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:4-management
```
