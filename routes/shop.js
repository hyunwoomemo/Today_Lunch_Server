const express = require("express");
const { authCheck } = require("../middleware/authCheck");

const router = express.Router();

const shopController = require("../controller/shopController");

router.post("/add", authCheck, shopController.add);
router.get("/list", authCheck, shopController.getAll);

module.exports = router;
