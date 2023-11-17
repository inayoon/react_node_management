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

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
});

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

// app.post("/update", upload.single("image"), (req, res) => {
//   const image = req.file.filename;
//   const sqlUpdate = "UPDATE EMPLOYEE SET image =?";
//   db.query(sqlUpdate, [image], (err, result) => {
//     if (err) return res.json({ Message: "Error updating" });
//     return res.json({ Status: "Success" });
//   });
// });

app.put("/update/:id", upload.single("image"), (req, res) => {
  const { id } = req.params;
  const { name, profession, city, phone, branch } = req.body;
  const image = req.file ? req.file.filename : "";
  const sqlUpdate =
    "UPDATE EMPLOYEE SET name = ?, profession = ?, city = ?, phone = ?,branch = ?,image = ? WHERE id = ?";
  db.query(
    sqlUpdate,
    [name, profession, city, phone, branch, image, id],
    (error, result) => {
      if (error) {
        console.log(error);
      }
      res.send(result);
    }
  );
});

app.get("/", (req, res) => {
  res.json("Hello world, this is backend server");
});

app.listen(5000, () => {
  console.log("Server is running...");
});
