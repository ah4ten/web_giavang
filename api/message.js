// /api/message.js
import mysql from "mysql2/promise";

let state = {
  mode: "manual",
  gold: "SJC",
  message: "Xin chao quy khach!",
  speed: 50,
  delay: 3000,
};

// ====== HÀM TẠO KẾT NỐI MYSQL ======
async function getDB() {
  return await mysql.createConnection({
    host: "localhost",    // 🔹 Thay bằng IP MySQL thật nếu deploy (vd: 127.0.0.1 hoặc cloud)
    user: "root",         // 🔹 Tên user MySQL
    password: "10000",   // 🔹 Mật khẩu
    database: "gia_vang",    // 🔹 Tên database
  });
}

// ====== HÀM GHI LOG ======
async function logEvent(eventType, data) {
  try {
    const conn = await getDB();
    const { mode, gold, message, speed, delay } = data;
    await conn.execute(
      "INSERT INTO logs (event_type, mode, gold, message, speed, delayMs) VALUES (?, ?, ?, ?, ?, ?)",
      [eventType, mode, gold, message, speed, delay]
    );
    await conn.end();
  } catch (err) {
    console.error("❌ Lỗi ghi log MySQL:", err.message);
  }
}

// ====== API CHÍNH ======
export default async function handler(req, res) {
  try {
    if (req.method === "POST") {
      const { mode, gold, message, speed, delay } = req.body;
      if (mode) state.mode = mode;
      if (gold) state.gold = gold;
      if (message) state.message = message;
      if (speed) state.speed = speed;
      if (delay) state.delay = delay;

      await logEvent("UPDATE_CONFIG", state);
      return res.status(200).json({ success: true, state });
    }

    if (req.method === "GET") {
      await logEvent("FETCH_CONFIG", state);
      return res.status(200).json(state);
    }

    return res.status(405).json({ error: "Method Not Allowed" });
  } catch (error) {
    console.error("💥 Lỗi server API:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
