const express = require("express");
const { authCheck } = require("../middleware/authCheck");
const recordController = require("../controller/recordController");

const router = express.Router();

router.post("/addRecord", authCheck, recordController.addRecord);
router.get("/getRecord", authCheck, recordController.getRecord);

module.exports = router;
