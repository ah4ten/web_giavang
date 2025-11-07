import { readFileSync, writeFileSync } from "fs";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { mode, gold, message, speed, delay } = req.body;

    // Ghi cấu hình vào file (ESP32 có thể đọc)
    const config = { mode, gold, message, speed, delay };
    writeFileSync("/data/led_config.json", JSON.stringify(config, null, 2));

    // Gửi tín hiệu ngay cho ESP32
    console.log("🟢 Đã cập nhật:", config);

    res.status(200).json({ status: "ok" });
  } else {
    res.status(405).json({ error: "Phương thức không hợp lệ" });
  }
}
