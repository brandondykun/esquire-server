const router = require("express").Router();
const pool = require("../db");
const { cookieJwtAuth } = require("../middleware/cookieJWTAuth");

// GET AN ADDRESS FOR A CLIENT
router.get("/:clientId", cookieJwtAuth, async (req, res) => {
  try {
    const user = req.user;
    const { clientId } = req.params;
    const corrQuery = await pool.query(
      "SELECT * FROM correspondence WHERE client_id = $1",
      [clientId]
    );
    const courtQuery = await pool.query(
      "SELECT * FROM court_appearance WHERE client_id = $1",
      [clientId]
    );
    const filingQuery = await pool.query(
      "SELECT * FROM filing WHERE client_id = $1",
      [clientId]
    );
    const meetingQuery = await pool.query(
      "SELECT * FROM filing WHERE client_id = $1",
      [clientId]
    );
    const phoneEmailQuery = await pool.query(
      "SELECT * FROM filing WHERE client_id = $1",
      [clientId]
    );

    const activities = {
      correspondence: corrQuery.rows.map((r) => {
        return { type: "correspondence", data: r };
      }),
      courtAppearance: courtQuery.rows.map((r) => {
        return { type: "courtAppearance", data: r };
      }),
      filing: filingQuery.rows.map((r) => {
        return { type: "filing", data: r };
      }),
      meeting: meetingQuery.rows.map((r) => {
        return { type: "meeting", data: r };
      }),
      phoneEmail: phoneEmailQuery.rows.map((r) => {
        return { type: "phoneEmail", data: r };
      }),
    };

    res.status(200).json(activities);
  } catch (error) {
    res.status(400);
  }
});

// ADD A CORRESPONDENCE
router.post("/correspondence", cookieJwtAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { date, inOut, name, partyType, deadline, comments, clientId } =
      req.body.data;

    const correspondenceQuery = await pool.query(
      `INSERT INTO 
        correspondence 
          (date, in_out, name, party_type, deadline, comments, client_id, user_id) 
        VALUES 
          ( $1, $2, $3, $4, $5, $6, $7, $8) 
        RETURNING *`,
      [date, inOut, name, partyType, deadline, comments, clientId, userId]
    );
    const newCorrespondence = correspondenceQuery.rows[0];
    const formatted = { type: "correspondence", data: newCorrespondence };
    res.status(201).json(formatted);
  } catch (error) {
    res.status(400).json({ error: "There was a problem saving that data." });
  }
});

module.exports = router;
