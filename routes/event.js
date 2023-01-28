const router = require("express").Router();
const pool = require("../db");
const { cookieJwtAuth } = require("../middleware/cookieJWTAuth");

// GET ALL EVENTS THAT BELONG TO A USER
router.get("/", cookieJwtAuth, async (req, res) => {
  try {
    const user = req.user;
    const events = await pool.query("SELECT * FROM event WHERE user_id = $1", [
      user.id,
    ]);
    res.status(200).json(events.rows);
  } catch (error) {
    res.status(400);
  }
});

// GET EVENT BY ID
router.get("/:eventId", cookieJwtAuth, async (req, res) => {
  try {
    const { eventId } = req.params;
    const user = req.user;
    const event = await pool.query("SELECT * FROM event WHERE id = $1", [
      eventId,
    ]);
    if (event.rows.length > 0) {
      // might want to verify that the event belongs to the user
      res.status(200).json(event.rows[0]);
    } else {
      res.status(403).json({ error: "Resource not found." });
    }
  } catch (error) {
    res.status(400);
  }
});

// DELETE AN EVENT
router.delete("/:eventId", cookieJwtAuth, async (req, res) => {
  try {
    const { eventId } = req.params;
    const didDelete = await pool.query("DELETE FROM event WHERE id = $1", [
      eventId,
    ]);
    if (didDelete) {
      res.status(200).json({ message: "Event successfully deleted." });
    } else {
      req.status(404).json({ error: "Resource not found in database." });
    }
  } catch (error) {
    res.status(401).json({ error: "There was a problem deleting that." });
  }
});

/**
 * MIGHT WANT TO CHECK THIS
 */
// EDIT AN EVENT
router.put("/:eventId", cookieJwtAuth, async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user.id;
    const { name, dateFrom, dateTo, meta, type } = req.body;

    const eventQuery = await pool.query(
      `UPDATE event 
        SET 
          id = $1, 
          user_id = $2, 
          name = $3, 
          date_from = $4, 
          date_to = $5, 
          meta = $6, 
          type = $7 
        WHERE id = $8 
          RETURNING *`,
      [eventId, userId, name, dateFrom, dateTo, meta, type, eventId]
    );
    const event = eventQuery.rows[0];
    res.status(200).json(event);
  } catch (error) {
    res.status(400).json({ error: "There was a problem saving that data." });
  }
});

// ADD AN EVENT
router.post("/", cookieJwtAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, dateFrom, dateTo, meta, type } = req.body;

    const eventQuery = await pool.query(
      `INSERT INTO event (user_id, name, date_from, date_to, meta, type)
        VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING *`,
      [userId, name, dateFrom, dateTo, meta, type]
    );
    const event = eventQuery.rows[0];
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ error: "There was a problem saving that data." });
  }
});

module.exports = router;
