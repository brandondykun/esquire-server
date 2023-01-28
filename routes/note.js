const router = require("express").Router();
const pool = require("../db");
const { cookieJwtAuth } = require("../middleware/cookieJWTAuth");

// GET ALL NOTES THAT BELONG TO A USER
router.get("/", cookieJwtAuth, async (req, res) => {
  try {
    const user = req.user;
    const notes = await pool.query("SELECT * FROM note WHERE user_id = $1", [
      user.id,
    ]);
    res.status(200).json(notes.rows);
  } catch (error) {
    res.status(400);
  }
});

// GET NOTE BY ID
router.get("/:id", cookieJwtAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;
    const note = await pool.query("SELECT * FROM note WHERE id = $1", [id]);
    if (note.rows.length > 0) {
      // might want to verify that the note belongs to the user
      res.status(200).json(note.rows[0]);
    } else {
      res.status(403).json({ error: "Resource not found in database." });
    }
  } catch (error) {
    res.status(400);
  }
});

// DELETE A NOTE
router.delete("/:id", cookieJwtAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const didDelete = await pool.query("DELETE FROM note WHERE id = $1", [id]);

    if (didDelete.rowCount > 0) {
      res.status(200).json({ message: "Note Deleted" });
    } else {
      res.status(404).json({ error: "Resource not found." });
    }
  } catch (error) {
    res.status(401).json({ error: "There was a problem deleting that." });
  }
});

// ADD A NOTE
router.post("/", cookieJwtAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { data, hasChanges, user_id, client_id } = req.body;

    const noteQuery = await pool.query(
      "INSERT INTO note (data, has_changes, user_id, client_id) VALUES ( $1, $2, $3, $4) RETURNING *",
      [data, hasChanges, user_id, client_id]
    );
    const note = noteQuery.rows[0];
    res.status(201).json(note);
  } catch (error) {
    res.status(400).json({ error: "There was a problem saving that data." });
  }
});

// EDIT A NOTE
router.put("/:noteId", cookieJwtAuth, async (req, res) => {
  try {
    const { noteId } = req.params;
    const userId = req.user.id;
    const { data, hasChanges, user_id, client_id } = req.body;

    const noteQuery = await pool.query(
      `UPDATE note 
        SET 
          id = $1, 
          data = $2, 
          has_changes = $3, 
          user_id = $4, 
          client_id = $5 
        WHERE id = $6 
          RETURNING *`,
      [noteId, data, hasChanges, user_id, client_id, noteId]
    );
    const note = noteQuery.rows[0];
    res.status(200).json(note);
  } catch (error) {
    res.status(400).json({ error: "There was a problem saving that data." });
  }
});

module.exports = router;
