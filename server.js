const express = require("express");
const bodyParse = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const route = require("./route");
require("dotenv").config();

const PORT = process.env.SERVER_PORT || 3000;
const expenseTrackerDb = process.env.MONGOOSE_CONNECTION;

const app = express();

app.use(bodyParse.json());
app.use(cors());

mongoose.connect(
  expenseTrackerDb,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if (err) {
      console.error("Erros!" + err);
    } else {
      console.log("connected to expense tracker db");
    }
  }
);

app.use("/route", route);

/* app.use(express.static("public"));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
}); */
app.get("/", (req, res) => {
  res.status(200).send("Hello from server");
});

app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});
