const router = require("express").Router();
const pool = require("../db");
const { cookieJwtAuth } = require("../middleware/cookieJWTAuth");

// GET AN ADDRESS FOR A CLIENT
router.get("/:clientId", cookieJwtAuth, async (req, res) => {
  try {
    const user = req.user;
    const { clientId } = req.params;
    const addressQuery = await pool.query(
      "SELECT * FROM address WHERE client_id = $1",
      [clientId]
    );
    const address = addressQuery.rows[0];
    res.status(200).json(address);
  } catch (error) {
    res.status(400);
  }
});

// ADD AN ADDRESS
router.post("/", cookieJwtAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { clientId, street, city, state, zip } = req.body;

    const addressQuery = await pool.query(
      "INSERT INTO address (client_id, street, city, state, zip) VALUES ( $1, $2, $3, $4, $5) RETURNING *",
      [clientId, street, city, state, zip]
    );
    const address = addressQuery.rows[0];
    res.status(201).json(address);
  } catch (error) {
    res.status(400).json({ error: "There was a problem saving that data." });
  }
});

// DELETE AN ADDRESS
router.delete("/:id", cookieJwtAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const didDelete = await pool.query("DELETE FROM address WHERE id = $1", [
      id,
    ]);
    if (didDelete) {
      res.status(200);
    } else {
      req.status(404).json({ error: "Resource not found in database." });
    }
  } catch (error) {
    res.status(401).json({ error: "There was a problem deleting that." });
  }
});

module.exports = router;
