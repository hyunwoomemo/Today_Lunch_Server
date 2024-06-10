const db = require("../db");

exports.getShopList = async () => {
  const [rows] = await db.query("SELECT * FROM shops");

  return rows;
};

exports.getShopData = async (userId) => {

  const [rows] = await db.query(
    "SELECT s.shop_id, s.name, s.address, AVG(um.star_rating) AS average_rating, MAX(um.visit_date) AS last_visit_date, COUNT(um.visit_date) AS total_visits FROM shops s LEFT JOIN menus m ON s.shop_id = m.shop_id LEFT JOIN user_menus um ON m.menu_id = um.menu_id WHERE um.user_id = (?) GROUP BY s.shop_id, s.name, s.address ORDER BY last_visit_date DESC;",
    [Number(userId)]
  );

  // (
  //   "SELECT s.shop_id, s.name, s.address, AVG(um.star_rating) AS average_rating, MAX(um.visit_date) AS last_visit_date, COUNT(um.visit_date) AS total_visits FROM shops s LEFT JOIN menus m ON s.shop_id = m.shop_id LEFT JOIN user_menus um ON m.menu_id = um.menu_id GROUP BY s.shop_id, s.name, s.address ORDER BY s.shop_id;"
  // )

  console.log("rows", rows);
  return rows;
};
