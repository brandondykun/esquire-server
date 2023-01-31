const express = require("express");
const app = express();
const cors = require("cors");
const port = 3003;
const pool = require("./db");
const jwt = require("jsonwebtoken");
var cookieParser = require("cookie-parser");
require("dotenv").config();
const { cookieJwtAuth } = require("./middleware/cookieJWTAuth");
const bcrypt = require("bcrypt");

app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:5173"],
  })
);
app.use(cookieParser());
app.use(express.json());

// REGISTER AND LOGIN ROUTES
app.use("/auth", require("./routes/jwtAuth"));
// CLIENTS ROUTES
app.use("/client", require("./routes/client"));
// ADDRESS ROUTES
app.use("/address", require("./routes/address"));
// CONTACT INFO ROUTES
app.use("/contact", require("./routes/contact"));
// NOTES ROUTES
app.use("/note", require("./routes/note"));
// EVENTS ROUTES
app.use("/event", require("./routes/event"));
// CASE ROUTES
app.use("/case", require("./routes/case"));

// Address
// app.get("/address/:id", (req, res) => {
//   const { id } = req.params;
//   res.send("An address");
// });

// app.post("/address", (req, res) => {
//   res.send("Create An address");
// });

// app.delete("/address/:id", (req, res) => {
//   const { id } = req.params;
//   res.send("Delete A address");
// });

// Cases
// app.get("/case", (req, res) => {
//   res.send("Cases");
// });

// app.get("/case/:id", (req, res) => {
//   const { id } = req.params;
//   res.send("A Case");
// });

// app.post("/case", (req, res) => {
//   res.send("Create A Case");
// });

// app.delete("/case/:id", (req, res) => {
//   const { id } = req.params;
//   res.send("Delete A Case");
// });

// Contact Info
app.get("/contactInfo/:id", (req, res) => {
  const { id } = req.params;
  res.send("A Contact Info");
});

app.post("/contactInfo", (req, res) => {
  res.send("Create A Contact Info");
});

app.delete("/contactInfo/:id", (req, res) => {
  res.send("Delete A Contact Info");
});

// Events
// app.get("/event", (req, res) => {
//   res.send("Events");
// });

// app.get("/event/:id", (req, res) => {
//   const { id } = req.params;
//   res.send("An Event");
// });

// app.post("/event", (req, res) => {
//   res.send("Create An Event");
// });

// app.delete("/event/:id", (req, res) => {
//   const { id } = req.params;
//   res.send("Delete An Event");
// });

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
