const router = require("express").Router();
const pool = require("../db");
const { cookieJwtAuth } = require("../middleware/cookieJWTAuth");

// GET ALL CLIENTS THAT BELONG TO A USER
router.get("/", cookieJwtAuth, async (req, res) => {
  try {
    const user = req.user;
    const clients = await pool.query(
      `SELECT 
        c.id, 
        c.first_name, 
        c.middle_name, 
        c.last_name, 
        c.user_id, 
        COUNT("case".id) AS case_count
      FROM client AS c
      LEFT JOIN "case"
        ON c.id = "case".client_id
      WHERE c.user_id = $1
      GROUP BY c.id
      ORDER BY c.id`,
      [user.id]
    );
    res.status(200).json(clients.rows);
  } catch (error) {
    res.status(400);
  }
});

// GET CLIENT BY ID
router.get("/:id", cookieJwtAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;
    const client = await pool.query("SELECT * FROM client WHERE id = $1", [id]);
    if (client.rows.length > 0) {
      // might want to verify that the client belongs to the user
      res.status(200).json(client.rows[0]);
    } else {
      res.status(403).json({ error: "Resource not found in database." });
    }
  } catch (error) {
    res.status(400);
  }
});

// ADD A CLIENT
router.post("/", cookieJwtAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { user, firstName, middleName, lastName } = req.body;

    const clientQuery = await pool.query(
      "INSERT INTO client (first_name, middle_name, last_name, user_id) VALUES ( $1, $2, $3, $4) RETURNING *",
      [firstName, middleName, lastName, user]
    );
    const client = clientQuery.rows[0];
    res.status(201).json(client);
  } catch (error) {
    res.status(400).json({ error: "There was a problem saving that data." });
  }
});

// EDIT A CLIENT
router.put("/:id", cookieJwtAuth, async (req, res) => {
  console.log("IN THE CLIENT NAME PUT");
  try {
    const userId = req.user.id;
    console.log("userId: ", userId);
    const { id } = req.params;
    console.log("id: ", id);

    const { firstName, middleName, lastName } = req.body;

    console.log("firstName: ", firstName);
    console.log("middleName: ", middleName);
    console.log("lastName: ", lastName);

    const clientQuery = await pool.query(
      "UPDATE client SET first_name = $1, middle_name = $2, last_name = $3, user_id = $4 WHERE id = $5 RETURNING *",
      [firstName, middleName, lastName, userId, id]
    );
    const client = clientQuery.rows[0];
    console.log("CLIENT: ", client);
    res.status(200).json(client);
  } catch (error) {
    res.status(400).json({ error: "There was a problem saving that data." });
  }
});

// DELETE A CLIENT
router.delete("/:id", cookieJwtAuth, async (req, res) => {
  try {
    const { id } = req.params;
    // Will want to delete everything for a client like address and cases
    const didDelete = await pool.query("DELETE FROM client WHERE id = $1", [
      id,
    ]);
    if (didDelete) {
      res.status(200).json({ message: "Client successfully deleted." });
    } else {
      req.status(404).json({ error: "Resource not found in database." });
    }
  } catch (error) {
    res.status(401).json({ error: "There was a problem deleting that." });
  }
});

module.exports = router;
