const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 8080;

app.get("/123", (req, res) => {
  res.send("Hello World!");
});

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
