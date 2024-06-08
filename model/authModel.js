const db = require("../db");

exports.getAllUser = async () => {
  const [rows] = await db.query("SELECT * FROM users");

  return rows[0];
};

exports.kakaoLogin = async () => {
  const [rows] = await db.query("SELECT * FROM users");

  console.log(rows);
  return rows[0];
};

exports.getUserInfo = async (userId) => {
  const [rows] = await db.query("SELECT user_id, createdAt FROM users where user_id = ?", [userId]);

  return rows[0];
};
