const db = require("../db");

exports.getRecordModel = async (userId) => {
  const [rows] = await db.query(
    "SELECT  um.user_id,um.visit_date,um.star_rating,um.review,s.name,s.address FROM user_menus um JOIN menus m ON um.menu_id = m.menu_id JOIN shops s ON m.shop_id = s.shop_id WHERE um.user_id = (?)",
    [userId]
  );

  console.log(rows);

  return rows;
};
