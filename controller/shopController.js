const db = require("../db");

const shopModel = require("../model/shopModel");

exports.add = async (req, res) => {
  const { name, address } = req.body;

  console.log(req.body);

  if (!name) {
    return res.json({ CODE: "SR001", message: "Missin required fields" });
  }

  try {
    const [result] = await db.query("insert into shops (name, address,createdAt) values (?, ?, ?)", [name, address, new Date()]);

    console.log("result", result);
    res.json({ CODE: "SR000", message: "User registered successfully", DATA: result.insertId });
  } catch (err) {
    if (err) {
      console.error(err);
      return res.sendStatus(500);
    }
  }
};

exports.getAll = async (req, res) => {
  console.log("get all 🔥");

  try {
    const shopList = await shopModel.getShopList();

    console.log("zxcmkzmxckmzc", shopList);

    res.json({ CODE: "SGL000", DATA: shopList });
  } catch (err) {
    if (err) {
      console.error(err);
      return res.sendStatus(500);
    }
  }
};