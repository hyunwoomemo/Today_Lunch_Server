const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 8080;
const authRouter = require("./routes/auth");
const shopRouter = require("./routes/shop");
const recordRouter = require("./routes/record");

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

const corsOptions = {
  origin: "*", // Allow all origins
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allow specific methods
  allowedHeaders: ["Origin", "Content-Type", "Accept", "Authorization"], // Allow specific headers
};

app.use(cors(corsOptions));

app.get("/123", (req, res) => {
  res.send("Hello World!");
});

app.use("/auth", authRouter);
app.use("/shop", shopRouter);
app.use("/record", recordRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
