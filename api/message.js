import { MongoClient } from 'mongodb';

let state = {
  mode: 'manual',
  gold: 'SJC',
  message: 'Xin chao quy khach!',
  speed: 50,
  delay: 3000,

  // ➕ Thêm hai giá trị cảm biến từ UNO
  temp: null,
  humi: null
};

// ===== KẾT NỐI MONGODB =====
const uri = process.env.MONGODB_URI;
let client;
let db;

async function connectDB() {
  if (db) return db;
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
  }
  db = client.db('esp32_logs');
  return db;
}

// ===== API CHÍNH =====
export default async function handler(req, res) {

  // ⭐ ESP32 gửi dữ liệu DHT11 lên server
  if (req.method === 'POST' && req.query.update === 'dht') {
    const { temp, humi } = req.body;

    if (temp) state.temp = temp;
    if (humi) state.humi = humi;

    return res.status(200).json({ success: true, state });
  }

  // ⭐ ESP32 hoặc giao diện yêu cầu đọc lại dữ liệu DHT
  if (req.method === 'GET' && req.query.dht === '1') {
    return res.status(200).json({
      temp: state.temp,
      humi: state.humi
    });
  }

  // ⭐ API CŨ — GIỮ NGUYÊN
  if (req.method === 'POST') {
    const { mode, gold, message, speed, delay } = req.body;

    if (mode) state.mode = mode;
    if (gold) state.gold = gold;
    if (message) state.message = message;
    if (speed) state.speed = speed;
    if (delay) state.delay = delay;

    return res.status(200).json({ success: true, state });
  }

  if (req.method === 'GET') {
    res.status(200).json(state);

    try {
      const db = await connectDB();
      const logs = db.collection('esp32_message_logs');
      await logs.insertOne({
        ...state,
        time: new Date(),
        source: 'ESP32'
      });
      console.log('Log ESP32 saved to MongoDB');
    } catch (err) {
      console.error('MongoDB log error:', err);
    }

    return;
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
