const express = require("express");
const { addIncome , getIncome , getIncomeById , updateIncome, deleteIncome } = require("../controller/incomeController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, addIncome);
router.get("/", authMiddleware, getIncome );
router.get("/:id", authMiddleware, getIncomeById );
router.put("/:id", authMiddleware, updateIncome );
router.delete("/:id", authMiddleware, deleteIncome );

module.exports = router;