const db = require("../db");
const groupModel = require("../model/groupModel");
const jwt = require("jsonwebtoken");

exports.createGroup = async (req, res) => {
  const { groupName, userId } = req.body;

  console.log("create group req", req);

  try {
    const [row] = await db.query("insert into `groups` (name, leader, createdAt) values (?, ?, ?)", [groupName, userId, new Date()]);

    console.log(row);

    const groupId = row.insertId;

    if (groupId) {
      const [row] = await db.query("insert into user_groups (group_id, user_id) values (?,?)", [groupId, userId]);
      console.log("sjdfknsdkf111", row);
      res.json({ CODE: "GC000", message: "group create success !!" });
    }
  } catch (err) {
    console.log(err);

    res.sendStatus(500);
  }
};
