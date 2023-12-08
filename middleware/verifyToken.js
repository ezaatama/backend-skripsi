const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.status(401).json({ message: "Unauthorized" });
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Sesi Anda Telah Habis!" });
    req.email = decoded.email;
    req.user = decoded.userId;
    req.role = decoded.role;

    console.log(req.user);
    console.log(req.role);
    next();
  });
};

module.exports = verifyToken;
