const router = require("express").Router();
const pool = require("../db");
const { cookieJwtAuth } = require("../middleware/cookieJWTAuth");

// GET ALL CASES THAT BELONG TO A USER
router.get("/user/:clientId", cookieJwtAuth, async (req, res) => {
  try {
    // console.log("GETTING CASES");
    const { clientId } = req.params;
    const user = req.user;
    const casesQuery = await pool.query(
      `SELECT * FROM "case" WHERE client_id = $1`,
      [clientId]
    );
    // console.log("CASES: ", casesQuery.rows);
    res.status(200).json(casesQuery.rows);
  } catch (error) {
    res.status(400);
  }
});

// GET CASE BY ID
router.get("/:caseId", cookieJwtAuth, async (req, res) => {
  try {
    const { caseId } = req.params;
    const user = req.user;
    const caseQuery = await pool.query('SELECT * FROM "case" WHERE id = $1', [
      caseId,
    ]);
    if (caseQuery.rows.length > 0) {
      // might want to verify that the client belongs to the user
      res.status(200).json(caseQuery.rows[0]);
    } else {
      res.status(403).json({ error: "Resource not found in database." });
    }
  } catch (error) {
    res.status(400);
  }
});

// ADD A CASE
router.post("/", cookieJwtAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, caseNumber, type, clientId } = req.body;
    // console.log("CASE BODY: ", req.body);

    const caseQuery = await pool.query(
      `INSERT INTO "case" (name, case_number, type, client_id) VALUES ( $1, $2, $3, $4) RETURNING *`,
      [name, caseNumber, type, clientId]
    );
    const newCase = caseQuery.rows[0];
    res.status(201).json(newCase);
  } catch (error) {
    res.status(400).json({ error: "There was a problem saving that data." });
  }
});

// EDIT A CASE
router.put("/:caseId", cookieJwtAuth, async (req, res) => {
  try {
    const { caseId } = req.params;
    const userId = req.user.id;
    const { name, caseNumber, type, clientId } = req.body;

    const caseQuery = await pool.query(
      `UPDATE "case" 
        SET 
          name = $1, 
          case_number = $2, 
          type = $3, 
          client_id = $4
        WHERE id = $5 
          RETURNING *`,
      [name, caseNumber, type, clientId, caseId]
    );
    const editedCase = caseQuery.rows[0];
    res.status(201).json(editedCase);
  } catch (error) {
    res.status(400).json({ error: "There was a problem saving that data." });
  }
});

module.exports = router;
