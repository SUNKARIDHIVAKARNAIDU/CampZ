const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  const bearer = req.headers.authorization;
  if (!bearer) return res.status(401).json({ message: "Token missing" });

  const token = bearer.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid or expired token" });
  }
};

exports.requireRole = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role)
      return res.status(403).json({ message: "Access denied" });
    next();
  };
};
