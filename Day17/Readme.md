# Day 17 – Logging & Monitoring

## 📌 Core Topic Focus

- Importance of logs in production
- Using Winston or Pino for structured logging
- API monitoring basics (status, uptime)

---

## 📝 Why Logging Matters

- Helps debug issues in **production**
- Tracks user actions (audit trails)
- Detects suspicious or malicious activity
- Supports compliance (financial/health apps)
- Provides performance analysis (slow APIs, errors)

---

## ⚡ Structured Logging vs console.log

- `console.log` → plain text, hard to search, no levels
- Structured Logging → JSON format, levels (`info`, `warn`, `error`, `debug`), integrates with tools (ELK, Grafana, Datadog)

Example:

```json
{
  "level": "info",
  "timestamp": "2025-09-19T15:22:45.123Z",
  "message": "Blog created",
  "blogId": "123",
  "author": "Ehtesham"
}
```
