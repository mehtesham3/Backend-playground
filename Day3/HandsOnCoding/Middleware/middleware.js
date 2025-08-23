
export function logging(req, res, next) {
  const start = Date.now();
  res.on("finish", () => {
    console.log(`${req.method} ${req.originalUrl} -> ${res.statusCode} (${Date.now() - start}ms)`);
  });
  next();
}

export function validate(req, res, next) {
  const { email, password } = req.body || {};
  if (!email || typeof email !== "string") {
    return next(Object.assign(new Error("Invalid credential for email"), { status: 400 }));
  }
  if (!password || typeof password !== "string") {
    return next(Object.assign(new Error("Invalid credential for password"), { status: 400 }));
  }
  next();
}

export function notFound(req, res, next) {
  res.status(404).json({ error: "Not Found" });
}
