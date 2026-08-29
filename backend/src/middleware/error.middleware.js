function notFound(req, res) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

function errorHandler(err, req, res, next) {
  console.error(err);
  // Controllers call res.status(x) before throwing so the status survives here -
  // fall back to err.status, then 500, only if that wasn't set.
  const status = err.status || (res.statusCode && res.statusCode !== 200 ? res.statusCode : 500);
  res.status(status).json({
    message: err.message || "Internal server error",
    ...(err.details ? { details: err.details } : {}),
  });
}

module.exports = { notFound, errorHandler };
