## 1. Request-Line Essentials

| Field        | Rule (RFC 9112 §3.2)                | Example bytes   |
| ------------ | ----------------------------------- | --------------- |
| Method       | Token, UPPER-CASE                   | `GET`           |
| SP           | Exactly one ASCII space (0x20)      | ` `             |
| Request-URI  | origin-form preferred for backend   | `/api/v1/users` |
| SP           | One more space                      | ` `             |
| HTTP-Version | `HTTP/1.0` or `HTTP/1.1` (no space) | `HTTP/1.1`      |
| CRLF         | `\r\n` (0x0D 0x0A)                  | `\r\n`          |

Full minimal line:
GET /api/v1/users HTTP/1.1\r\n
