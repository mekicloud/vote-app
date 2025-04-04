require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// 🔗 Connect to DB
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "P@ssw0rd", // เปลี่ยนตามจริง
  database: "Vote_Ethics"
});

db.connect(err => {
  if (err) console.error("DB Error:", err);
  else console.log("Connected to DB");
});

// 🔘 GET: รายชื่อกรรมการตาม group
app.get("/api/committees/:group", (req, res) => {
  const sql = "SELECT * FROM m_committee WHERE comm_group = ?";
  db.query(sql, [req.params.group], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// 📌 2.1 ดึงรายชื่อที่ยังไม่โหวต
app.get("/api/committees", (req, res) => {
  const sql = "SELECT comm_id, comm_name, comm_group FROM m_committee WHERE has_voted = FALSE";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});



// 📌 2.2 ดึงรายชื่อทั้งหมด (ถ้าอยากแสดง admin panel)
app.get("/api/all-committees", (req, res) => {
  const sql = "SELECT * FROM m_committee";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// 📌 2.3 เพิ่มโหวต พร้อมอัปเดต has_voted และบันทึก voter_id
app.post("/api/vote", (req, res) => {
  const { committee_id, voter_id } = req.body;

  const checkSql = "SELECT has_voted FROM m_committee WHERE comm_id = ?";
  db.query(checkSql, [voter_id], (err, results) => {
    if (err || results.length === 0) return res.status(500).json({ error: "ไม่พบผู้ใช้" });

    if (results[0].has_voted)
      return res.status(400).json({ error: "คุณได้ใช้สิทธิ์ไปแล้ว" });

    // ยังไม่โหวต → INSERT
    const insertSql = "INSERT INTO vote_results (committee_id, voter_id) VALUES (?, ?)";
    db.query(insertSql, [committee_id, voter_id], (err) => {
      if (err) return res.status(500).json({ error: err.message });

      const updateSql = "UPDATE m_committee SET has_voted = TRUE WHERE comm_id = ?";
      db.query(updateSql, [voter_id]);

      res.json({ success: true, message: "Vote submitted!" });
    });
  });
});

// 📊 GET: คะแนนโหวต
app.get("/api/vote-count/:group", (req, res) => {
  const sql = `
    SELECT c.comm_id, c.comm_name, COUNT(v.id) AS vote_count
    FROM m_committee c
    LEFT JOIN vote_results v ON c.comm_id = v.committee_id
    WHERE c.comm_group = ?
    GROUP BY c.comm_id
  `;
  db.query(sql, [req.params.group], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// ✅ ตรวจสอบว่า voter เคยโหวตแล้วหรือยัง
app.get("/api/has-voted/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT has_voted FROM m_committee WHERE comm_id = ?";
  db.query(sql, [id], (err, results) => {
    if (err || results.length === 0) {
      return res.status(404).json({ error: "ไม่พบข้อมูล" });
    }
    res.json({ hasVoted: results[0].has_voted });
  });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));