const db = require("../db");

exports.createGroup = async (name, userId) => {
  try {
    const [result] = await db.query("insert into groups (name, leader, createdAt) values (?, ?, ?)", [name, userId, new Date()]);

    console.log("result", result);
    return result;
  } catch (err) {
    console.error(err);
  }
};
