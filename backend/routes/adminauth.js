const router = require("express").Router();
const db = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/**
 * CREATE ADMIN (run once)
 */

router.post("/create-admin", async (req, res) => {

  try {

    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({
        error: "Email and password required"
      });

    const existing = await db.query(
      "SELECT * FROM admin WHERE email=$1",
      [email]
    );

    if (existing.rows.length)
      return res.status(400).json({
        error: "Admin already exists"
      });

    const hashedPassword =
      await bcrypt.hash(password, 10);

    await db.query(
      "INSERT INTO admin (email,password) VALUES ($1,$2)",
      [email, hashedPassword]
    );

    res.json({
      message: "Admin created successfully"
    });

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }

});

/**
 * ADMIN LOGIN
 */

router.post("/login", async (req, res) => {

  try {

    const { email, password } = req.body;

    const result = await db.query(
      "SELECT * FROM admin WHERE email=$1",
      [email]
    );

    if (!result.rows.length)
      return res.status(401).json({
        error: "Invalid credentials"
      });

    const admin = result.rows[0];

    const valid =
      await bcrypt.compare(
        password,
        admin.password
      );

    if (!valid)
      return res.status(401).json({
        error: "Invalid credentials"
      });

    const token = jwt.sign(
      { admin_id: admin.id },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({ token });

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }

});

module.exports = router;
