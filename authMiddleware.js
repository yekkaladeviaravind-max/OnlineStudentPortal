const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  const authorization = req.get("Authorization") || "";
  const [scheme, token] = authorization.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ message: "Access denied. Please log in." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.studentId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Your session is invalid or expired. Please log in again." });
  }
}

module.exports = authMiddleware;
