const express = require("express");

const {
    getDashboardSummary,
    getMonthlySummary,
    getCategorySummary,
    getRecentTransactions
} = require("../dashboard/dashboardController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/summary", authMiddleware, getDashboardSummary);
router.get("/monthly", authMiddleware, getMonthlySummary);
router.get("/categories", authMiddleware, getCategorySummary);
router.get("/transactions", authMiddleware, getRecentTransactions);

module.exports = router;
