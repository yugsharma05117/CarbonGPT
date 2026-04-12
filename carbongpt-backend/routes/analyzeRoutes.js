const express = require("express");
const router = express.Router();

// Import controller
const analyzeController = require("../controllers/analyzeController");

// Define route
router.post("/analyze", analyzeController.analyzeController);

module.exports = router;