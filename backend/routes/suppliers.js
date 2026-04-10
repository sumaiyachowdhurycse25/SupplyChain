const express = require("express");
const router = express.Router();
const Suppliers = require("../models/suppliersModel");
const adminAuth = require("../middleware/adminAuth");
// Get all suppliers
router.get("/", adminAuth, async (req, res) => {
  try {
    res.json(await Suppliers.getAll());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add supplier
router.post("/", adminAuth, async (req, res) => {
  try {
    res.status(201).json(await Suppliers.create(req.body));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update supplier
router.put("/:id", adminAuth, async (req, res) => {
  try {
    res.json(await Suppliers.update(req.params.id, req.body));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete supplier
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    await Suppliers.remove(req.params.id);
    res.json({ message: "Supplier deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
