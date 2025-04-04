const mysql = require("mysql");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",      // หรือ user ของ MySQL
  password: "P@ssw0rd",      // ใส่รหัสผ่าน MySQL ถ้ามี
  database: "vote_ethics",  // ใช้ชื่อฐานข้อมูลใหม่
});

db.connect((err) => {
  if (err) {
    console.error("❌ Database Connection Failed:", err);
    return;
  }
  console.log("✅ Connected to MySQL Database: vote_ethics");
});

module.exports = db;