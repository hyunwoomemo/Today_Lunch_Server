const db = require("../db");

exports.getShopList = async () => {
  const [rows] = await db.query("SELECT * FROM shops");

  return rows;
};
