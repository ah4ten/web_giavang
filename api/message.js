// /api/message.js
import mysql from "mysql2/promise"; // 🧩 Thêm thư viện MySQL

// ====== CẤU HÌNH KẾT NỐI MYSQL ======
const db = await mysql.createPool({
  host: "localhost",      // đổi lại cho phù hợp
  user: "root",           // user MySQL của bạn
  password: "100100",     // mật khẩu MySQL
  database: "gia_vang",      // tên database
});

// ====== BIẾN LƯU TRẠNG THÁI ======
let state = {
  mode: "manual",
  gold: "SJC",
  message: "Xin chao quy khach!",
  speed: 50,
  delay: 3000,
};

// ====== HÀM GHI LOG ======
async function logEvent(eventType, data) {
  try {
    const { mode, gold, message, speed, delay } = data;
    await db.query(
      "INSERT INTO logs (event_type, mode, gold, message, speed, delayMs) VALUES (?, ?, ?, ?, ?, ?)",
      [eventType, mode, gold, message, speed, delay]
    );
  } catch (err) {
    console.error("Lỗi ghi log MySQL:", err.message);
  }
}

// ====== API CHÍNH ======
export default async function handler(req, res) {
  if (req.method === "POST") {
    const { mode, gold, message, speed, delay } = req.body;
    if (mode) state.mode = mode;
    if (gold) state.gold = gold;
    if (message) state.message = message;
    if (speed) state.speed = speed;
    if (delay) state.delay = delay;

    // 🧩 Ghi log sự kiện cập nhật
    await logEvent("UPDATE_CONFIG", state);

    return res.status(200).json({ success: true, state });
  }

  if (req.method === "GET") {
    // 🧩 Ghi log khi ESP32 đọc dữ liệu
    await logEvent("FETCH_CONFIG", state);

    return res.status(200).json(state);
  }

  return res.status(405).json({ error: "Method Not Allowed" });
}
