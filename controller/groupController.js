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

exports.getList = async (req, res) => {
  const { userId } = req.params;

  try {
    const [row] = await db.query("select g.group_id, g.name, g.createdAt, g.leader from `groups` g join user_groups ug on ug.group_id = g.group_id where ug.user_id = (?)", [userId]);

    console.log("sdm,fsmdkf", row);

    res.json({ CODE: "GL000", DATA: row });
    console.log("sdm,fsmdkf");
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};
