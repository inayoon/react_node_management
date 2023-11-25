import express from "express";
import mysql from "mysql2";
import cors from "cors";
import multer from "multer";
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

app.delete("/employees", (req, res) => {
  const { ids } = req.body;

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ error: "Invalid input" });
  }
  const placeholders = ids.map(() => "?").join(",");
  const sqlRemove = `DELETE FROM EMPLOYEE WHERE id IN (${placeholders})`;

  db.query(sqlRemove, ids, (error, result) => {
    if (error) {
      console.log(error);
      return res.status(500).json({ error: "Error deleting employees" });
    }
    return res.json({ message: "Employees deleted successfully" });
  });
});

app.delete("/employees/:id", (req, res) => {
  const { id } = req.params;
  const sqlRemove = "DELETE FROM EMPLOYEE WHERE id = ?";
  db.query(sqlRemove, id, (error, result) => {
    if (error) {
      console.log(error);
      return res.status(500).json({ error: "Error deleting employee" });
    }
    return res.json({ message: "Employee deleted successfully" });
  });
});

app.post("/add", upload.single("image"), (req, res) => {
  const { name, profession, city, phone, branch } = req.body;
  const image = req.file ? req.file.filename : req.body.image || "";
  const sqlInsert = "INSERT INTO EMPLOYEE VALUES  (null, ?, ?, ?, ?, ?,?)";
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
  const image = req.file ? req.file.filename : req.body.image || "";

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

app.listen(5000, () => {
  console.log("Server is running...");
});
