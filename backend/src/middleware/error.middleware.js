function notFound(req, res) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

function errorHandler(err, req, res, next) {
  console.error(err);

  // Controllers call res.status(x) before throwing a curated, user-safe message -
  // that explicit status is our signal that err.message is meant to be shown.
  // No explicit status means an unexpected exception (e.g. a DB driver error)
  // bubbled up unhandled - its message/stack must never reach the client.
  const explicitStatus = err.status || (res.statusCode && res.statusCode !== 200 ? res.statusCode : null);
  const status = explicitStatus || 500;
  const message = explicitStatus ? err.message || "An error occurred" : "Something went wrong. Please try again.";

  res.status(status).json({
    message,
    ...(explicitStatus && err.details ? { details: err.details } : {}),
  });
}

module.exports = { notFound, errorHandler };
