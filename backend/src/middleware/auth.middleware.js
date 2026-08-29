const jwt = require("jsonwebtoken");
const { signSessionToken, SESSION_TIMEOUT_MS } = require("../utils/token");

function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Authentication token missing" });
  }

  try {
    // We enforce our own inactivity rule below rather than the token's nominal exp,
    // so an active user's session keeps sliding forward instead of hard-cutting at
    // a fixed time from login.
    const payload = jwt.verify(token, process.env.JWT_SECRET, { ignoreExpiration: true });
    const lastSeenMs = payload.lastSeen || payload.iat * 1000;

    if (Date.now() - lastSeenMs > SESSION_TIMEOUT_MS) {
      return res.status(401).json({ message: "Session expired due to inactivity. Please log in again." });
    }

    req.userId = payload.userId;

    // Slide the window: reissue a token stamped with the current activity time.
    const refreshedToken = signSessionToken(payload.userId);
    res.setHeader("X-Refreshed-Token", refreshedToken);

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired session" });
  }
}

module.exports = { requireAuth };
