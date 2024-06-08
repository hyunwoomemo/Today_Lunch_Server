const { default: axios } = require("axios");
const userModel = require("../model/authModel");
const db = require("../db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

const SECRET_KEY = "gusdmswldnqldks";
const SALT_ROUNDS = 10;

exports.logUser = async (req, res) => {
  const user = await userModel.getAllUser();

  res.status(200).json({
    message: "모든 유저",
    user,
  });
};

exports.kakaoLogin = async (req, res) => {
  const user = await userModel.getAllUser();

  console.log(req.body);

  const { accessToken, refreshToken } = req.body;

  try {
    const kakaoResponse = await axios.get("https://kapi.kakao.com/v2/user/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const kakaoUser = kakaoResponse.data;

    console.log("🔥 kakao user", kakaoUser);

    const { id, properties, kakao_account } = kakaoUser;

    db.query("select * from user where kakao_id = ?", [id], (err, results) => {
      if (err) {
        console.error(err);
        return res.sendStatus(500);
      }

      if (results.length > 0) {
        const user = results[0];

        const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: "1h" });

        return res.json({ message: "Login successful", token });
      } else {
        // 사용자 없음 (회원가입 처리)
        const username = properties.nickname;
        const profile_image = properties.profile_image;

        db.query("INSERT INTO user (kakao_id, nickname, profile_image) VALUES (?, ?, ?)", [id, username, profile_image], (err, result) => {
          if (err) {
            console.error(err);
            return res.sendStatus(500);
          }

          const userId = result.insertId;
          const token = jwt.sign({ id: userId }, SECRET_KEY, { expiresIn: "1h" });

          return res.json({ message: "Signup and login successful", token });
        });
      }
    });
  } catch (err) {
    console.error(err);
  }
};

exports.login = async (req, res) => {
  const { id, password } = req.body;

  if (!id || !password) {
    console.log("🔥🔥");
    return res.json({ CODE: "AL001", message: "Missing required fields" });
  }
  console.log("🔥🔥🔥🔥");

  try {
    const [results] = await db.query("SELECT * FROM users WHERE userId = ?", [id]);

    if (results.length === 0) {
      console.log("results", results);
      return res.json({ CODE: "AL002", message: "Invalid username or password" });
    }

    const user = results[0];
    console.log(results);
    console.log(password, user.password);
    const isMatch = await bcrypt.compare(password, user.password);

    console.log("isMatch", isMatch);

    if (!isMatch) {
      return res.json({ CODE: "AL002", message: "Invalid username or password" });
    }

    const accessToken = jwt.sign({ id: user.user_id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "3m" });
    const refreshToken = jwt.sign({ user_id: user.user_id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });

    console.log("🔥🔥🔥🔥🔥🔥🔥🔥", user, accessToken, refreshToken);

    res.json({ CODE: "AL000", message: "Login successful", TOKEN: { accessToken, refreshToken }, DATA: { id: user.user_id } });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

exports.register = async (req, res) => {
  const { id, password } = req.body;

  console.log(req.body);

  if (!id || !password) {
    return res.json({ CODE: "AR001", message: "Missin required fields" });
  }

  try {
    const [result] = await db.query("select * from users where userId = ?", [id]);

    console.log("🔥", result);
    if (result.length > 0) {
      return res.json({ CODE: "AR002", message: "not available" });
    } else {
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

      db.query("insert into users (userId, password, createdAt) values (?,?,?)", [id, hashedPassword, new Date()], (err, result) => {
        if (err) {
          if (err.code === "ER_DUP_ENTRY") {
            return res.json({ CODE: "AR003", message: "ID already exists" });
          }

          console.error(err);
          return res.sendStatus(500);
        }
      });
      res.json({ CODE: "AR000", message: "User registered successfully" });
    }
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

exports.check = async (req, res) => {
  const { newAccessToken } = req;
  res.json({ CODE: "AC000", message: "success", DATA: { accessToken: newAccessToken } });
};

exports.refresh = async (req, res) => {
  const refreshToken = req.headers.refresh;

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.json({ CODE: "ART001", message: "refreshtoken invalid" });

    const payload = {
      ...user,
      exp: Math.floor(Date.now() / 1000) + 60 * 10, // 1분 후 만료
    };

    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET);
    res.json({ CODE: "ART000", message: "refresh successful", TOKEN: { accessToken } });
  });
};

// exports.info = async (req, res) => {
//   console.log("ksdmfksdmfk", req.headers.authorization);
//   const token = await req.headers.authorization.split(" ")[1];
//   console.log("Token:", token);

//   const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
//   console.log("Decoded JWT:", decoded);
//   const userId = decoded.id;
//   console.log("User ID:", userId);

//   try {

//   } catch (error) {
//     console.error("JWT Verification Error:", error);
//     return res.json({ CODE: "AI003", MESSAGE: "Invalid token" });
//   }
// };
exports.info = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  console.log("Token:", token);

  try {
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log("Decoded Token:", decodedToken);

    if (!decodedToken || !decodedToken.user_id) {
      return res.json({ CODE: "AI001", MESSAGE: "Invalid token111" });
    }

    const userId = decodedToken.user_id;
    console.log("User ID:", userId);

    const info = await userModel.getUserInfo(userId);

    console.log("info", info);

    res.json({ CODE: "AI000", DATA: info });
  } catch (error) {
    console.error("JWT Verification Error:", error);
    return res.json({ CODE: "AI003", MESSAGE: "Invalid token" });
  }
};
