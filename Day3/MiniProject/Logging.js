export function loggingMiddleware(req, res, next) {
  const start = Date.now();
  res.on(`finish`, () => {
    console.log(`${req.method} ${req.originalUrl} -> ${res.statusCode} ${Date.now() - start}`);
  })
  next();
}