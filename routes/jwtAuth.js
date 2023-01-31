const router = require("express").Router();
const pool = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// LOG IN A USER
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const userQuery = await pool.query('SELECT * FROM "user" WHERE email = $1', [
    email,
  ]);

  const user = userQuery.rows[0];
  const correctPassword = await bcrypt.compare(password, user.password);

  if (!correctPassword) {
    return res.status(403).json({ error: "Invalid login" });
  }

  delete user.password;
  const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "1h" });

  res.cookie("token", token, {
    httpOnly: true,
    // secure: true,
    // maxAge: 10000000,
    // signed: true
    // sameSite: "none",
  });

  return res.status(200).json({ email: user.email, id: user.id });
});

// REGISTER A NEW USER
router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  const userQuery = await pool.query('SELECT * FROM "user" WHERE email = $1', [
    email,
  ]);

  const matches = userQuery.rows;
  if (matches.length > 0) {
    return res.status(401).json({ error: "Username already exists" });
  }

  const saltRound = 10;
  const salt = await bcrypt.genSalt(saltRound);

  const bcryptPassword = await bcrypt.hash(password, salt);

  const newUserQuery = await pool.query(
    'INSERT INTO "user" (email, password) VALUES ($1, $2) RETURNING id, email',
    [email, bcryptPassword]
  );

  newUser = newUserQuery.rows[0];
  const token = jwt.sign(newUser, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res.cookie("token", token, {
    httpOnly: true,
    // secure: true,
    // maxAge: 10000000,
    // signed: true
  });

  return res.status(201).json({ email: newUser.email, id: newUser.id });
});

// WHO AM I ROUTE - CONFIRM LOGIN
router.get("/whoami", async (req, res) => {
  const token = req.cookies.token;
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    const userEmail = user.email;
    const userQuery = await pool.query(
      'SELECT * FROM "user" WHERE email = $1',
      [userEmail]
    );
    const foundUser = userQuery.rows[0];
    return res.status(200).json({ email: foundUser.email, id: foundUser.id });
  } catch (err) {
    res.clearCookie("token");
    return res.status(403).json({ error: "Unauthorized" });
  }
});

// WHO AM I ROUTE - CONFIRM LOGIN
router.post("/logout", async (req, res) => {
  try {
    const token = req.cookies.token;
    if (token) {
      res.clearCookie("token");
      return res.status(200).json({ message: "Successfully logged out." });
    }
  } catch (err) {
    return res.status(401).json({ error: "Error logging out" });
  }
});

module.exports = router;
