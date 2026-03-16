const jwt = require("jsonwebtoken");
const verifyGoogleToken = require("./verifyGoogleToken");

async function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return {
      userId: decoded.userId,
      email: decoded.email,
      name: decoded.name,
    };
  } catch {
    return await verifyGoogleToken(token);
  }
}

module.exports = verifyToken;