const express = require("express");

const { createBill , getBills , updateBill , deleteBill , getBillById } = require("../controller/billController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createBill);
router.get("/", authMiddleware, getBills);
router.put("/:id", authMiddleware, updateBill);
router.delete("/:id", authMiddleware, deleteBill);
router.get("/:id", authMiddleware, getBillById);

module.exports = router;