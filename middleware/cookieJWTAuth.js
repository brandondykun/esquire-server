const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.cookieJwtAuth = (req, res, next) => {
  const token = req.cookies.token;
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");

  res.setHeader("Access-Control-Allow-Credentials", true);
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (err) {
    res.clearCookie("token");
    return res.status(401).json({ error: "NO TOKEN" });
  }
};
