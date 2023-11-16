const express = require("express");
const fs = require("fs");
const app = express();
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const cors = require("cors");

const data = fs.readFileSync("./database.json");
const conf = JSON.parse(data);
const db = mysql.createConnection({
  host: conf.host,
  user: conf.user,
  password: conf.password,
  port: conf.port,
  database: conf.database,
});
db.connect();
const multer = require("multer");
const upload = multer({ dest: "./upload" });

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/employees", (req, res) => {
  const sqlGet = "SELECT * FROM EMPLOYEE";
  db.query(sqlGet, (err, result) => {
    if (err) return res.json(err);
    return res.json(result);
  });
});

app.get("/", (req, res) => {
  res.json("Hello world, this is backend server");
});

app.listen(5000, () => {
  console.log("Server is running...");
});
