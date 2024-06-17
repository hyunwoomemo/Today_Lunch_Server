const express = require("express");

const router = express.Router();

const groupController = require("../controller/groupController");
const { authCheck } = require("../middleware/authCheck");

router.post("/createGroup", authCheck, groupController.createGroup);
router.get("/getGroupList/:userId", authCheck, groupController.getList);

module.exports = router;
