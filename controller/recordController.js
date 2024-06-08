const db = require("../db");
const recordModel = require("../model/recordModel");
const jwt = require("jsonwebtoken");

exports.addRecord = async (req, res) => {
  const { shop, address, menu, price, rating, review, date, userId } = req.body;

  console.log("addrecord req", req);

  try {
    const [shopResult] = await db.query("insert into shops (name, address,createdAt) values (?, ?, ?)", [shop, address, new Date(date)]);

    const shopId = shopResult.insertId;

    const [menuResult] = await db.query("insert into menus (shop_id, menu_name, price, createdAt) values (?,?,?,?)", [shopId, menu, price, new Date(date)]);

    console.log("🔥 menu result", menuResult);

    const menuId = menuResult.insertId;

    console.log("🔥 menu Id", menuId);

    const [userMenuResult] = await db.query("insert into user_menus (user_id, menu_id, star_rating, review, visit_date) values (?,?,?,?,?)", [userId, menuId, rating, review, new Date(date)]);

    console.log("🔥 user menu result", userMenuResult);

    res.json({ CODE: "RA000", message: "success !!" });
  } catch (err) {
    console.log(err);

    res.sendStatus(500);
  }
};

exports.getRecord = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  console.log("Token:", token);

  try {
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log("Decoded Token:", decodedToken);

    if (!decodedToken || !decodedToken.user_id) {
      return res.json({ CODE: "AI001", MESSAGE: "Invalid token" });
    }

    const userId = decodedToken.user_id;

    console.log("userId", userId);
    const data = await recordModel.getRecordModel(userId);

    console.log("dat123a", data);
    res.json({ CODE: "GR000", DATA: data });
  } catch (err) {
    console.log(err);
    res.json({ CODE: "GR001", message: "get record error" });
  }
};
