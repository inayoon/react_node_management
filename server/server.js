import express from "express";
import mysql from "mysql2";
import cors from "cors";
import multer from "multer";
import path from "path";
import fs from "fs";

const app = express();

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

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images");
  },
  filename: function (req, file, cb) {
    return cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage });

app.get("/employees", (req, res) => {
  const sqlGet = "SELECT * FROM EMPLOYEE";
  db.query(sqlGet, (err, result) => {
    if (err) return res.json(err);
    return res.json(result);
  });
});

app.get("/employees/:id", (req, res) => {
  const { id } = req.params;
  const sqlGet = "SELECT * FROM EMPLOYEE WHERE id = ?";
  db.query(sqlGet, id, (error, result) => {
    if (error) {
      console.log(error);
    }
    res.send(result);
  });
});

app.post("/add", upload.single("image"), (req, res) => {
  const { name, profession, city, phone, branch } = req.body;
  const image = req.file ? req.file.filename : req.body.image || "";
  const sqlInsert = "INSERT INTO EMPLOYEE VALUES  (null, ?, ?, ?, ?, ?,?)";
  // let img = "http://localhost:5000/image/" + image;
  db.query(
    sqlInsert,
    [name, profession, city, phone, branch, image],
    (err, result) => {
      if (err) return res.json({ Message: "Error updating" });
      return res.json({ Status: "Success" });
    }
  );
});

app.put("/update/:id", upload.single("image"), (req, res) => {
  const { id } = req.params;
  const { name, profession, city, phone, branch } = req.body;
  const image = req.file ? req.file.filename : req.body.image || ""; // 이미지가 전송되지 않은 경우 이전 이미지 유지

  const sqlUpdate =
    "UPDATE EMPLOYEE SET name = ?, profession = ?, city = ?, phone = ?, branch = ?, image = ? WHERE id = ?";
  db.query(
    sqlUpdate,
    [name, profession, city, phone, branch, image, id],
    (error, result) => {
      if (error) {
        console.log(error);
        res.json({ Status: "Failed", Error: error.message });
      }
      res.json({ Status: "Success", ImagePath: image });
    }
  );
});

app.get("/", (req, res) => {
  res.json("Hello world, this is backend server");
});

app.listen(5000, () => {
  console.log("Server is running...");
});
