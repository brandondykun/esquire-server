const router = require("express").Router();
const pool = require("../db");
const { cookieJwtAuth } = require("../middleware/cookieJWTAuth");

// ADD CONTACT INFO
router.post("/", cookieJwtAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { email, phone, clientId } = req.body;

    const contactQuery = await pool.query(
      "INSERT INTO contact (email, phone, client_id ) VALUES ( $1, $2, $3) RETURNING *",
      [email, phone, clientId]
    );
    const contact = contactQuery.rows[0];
    res.status(201).json(contact);
  } catch (error) {
    res.status(400).json({ error: "There was a problem saving that data." });
  }
});

// GET CONTACT INFO BY CLIENT ID
router.get("/:clientId", cookieJwtAuth, async (req, res) => {
  try {
    const { clientId } = req.params;
    const user = req.user;
    const contactQuery = await pool.query(
      "SELECT * FROM contact WHERE client_id = $1",
      [clientId]
    );
    if (contactQuery.rows.length > 0) {
      // might want to verify that the client belongs to the user
      res.status(200).json(contactQuery.rows[0]);
    } else {
      res.status(403).json({ error: "Resource not found in database." });
    }
  } catch (error) {
    res.status(400);
  }
});

// DELETE CONTACT INFO
router.delete("/:id", cookieJwtAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const didDelete = await pool.query("DELETE FROM contact WHERE id = $1", [
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
