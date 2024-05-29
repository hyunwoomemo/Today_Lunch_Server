const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 8080;

const corsOptions = {
  origin: "*", // Allow all origins
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allow specific methods
  allowedHeaders: ["Origin", "Content-Type", "Accept", "Authorization"], // Allow specific headers
};

app.use(cors(corsOptions));

app.get("/123", (req, res) => {
  res.send("Hello World!");
});

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
