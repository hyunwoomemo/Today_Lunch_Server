const express = require("express");
const { authCheck } = require("../middleware/authCheck");

const router = express.Router();

const shopController = require("../controller/shopController");

router.post("/add", authCheck, shopController.add);
router.get("/list/:userId", authCheck, shopController.getAll);
router.get("/getData/:userId", authCheck, shopController.getShopData);

module.exports = router;
