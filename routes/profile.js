
// routes/auth.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sql, pool } = require("../controller/connect.js");
require("dotenv").config();
const { verifyToken } = require("../middleware/auth");



router.put("/avatar", verifyToken, async (req, res) => {
  const { avatar_url } = req.body;
  const userId = req.user.id;

  try {
    await pool
      .request()
      .input("avatar_url", sql.VarChar, avatar_url)
      .input("userId", sql.Int, userId)
      .query("UPDATE users SET avatar_url = @avatar_url WHERE id = @userId");

    res.status(200).json({ message: "Avatar updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update avatar", message: err.message });
  }
});


// Update bio
router.put("/bio", verifyToken, async (req, res) => {
  const { bio } = req.body;
  const userId = req.user.id;

  try {
    await pool.request()
      .input("id", sql.Int, userId)
      .input("bio", sql.Text, bio)
      .query("UPDATE users SET bio = @bio WHERE id = @id");

    res.status(200).json({ message: "Bio updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update bio", message: err.message });
  }
});


router.get("/me", verifyToken, async (req, res) => {
  try {
    const result = await pool.request()
      .input("userId", sql.Int, req.user.id)
      .query(`
        SELECT username, email, role, avatar_url, bio, created_at 
        FROM users WHERE id = @userId
      `);
    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch profile", message: err.message });
  }
});
module.exports = router;