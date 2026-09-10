const express = require("express");
const { createExpense , getExpenses , getExpenseById , deleteExpense , updateExpense } = require("../controller/expenseController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createExpense);
router.get("/", authMiddleware, getExpenses );
router.get("/:id", authMiddleware, getExpenseById );
router.put("/:id", authMiddleware, updateExpense );
router.delete("/:id", authMiddleware, deleteExpense );


module.exports = router;
