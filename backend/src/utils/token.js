const jwt = require("jsonwebtoken");

// FR05/NFR07 - sessions expire after 30 minutes of INACTIVITY, not a flat timer.
// Every token carries a lastSeen stamp; the auth middleware compares against it
// on each request and reissues a fresh token to slide the window forward.
const SESSION_TIMEOUT_MS = 30 * 60 * 1000;

function signSessionToken(userId, lastSeen = Date.now()) {
  return jwt.sign({ userId, lastSeen }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "30m",
  });
}

module.exports = { signSessionToken, SESSION_TIMEOUT_MS };
