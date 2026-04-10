const express = require("express");
const router = express.Router();
const Alerts = require("../models/alertsModel");
const adminAuth = require("../middleware/adminAuth");
router.get("/", adminAuth, async (req, res) => {
  try {
    res.json(await Alerts.getUnread());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

