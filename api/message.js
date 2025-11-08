import { MongoClient } from "mongodb";

let state = {
  mode: "manual",
  gold: "SJC",
  message: "Xin chao quy khach!",
  speed: 50,
  delay: 3000,
};

const uri = process.env.MONGODB_URI;
let client;

async function connectDB() {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
  }
  return client.db("led_dashboard").collection("logs");
}

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { mode, gold, message, speed, delay } = req.body;

    if (mode) state.mode = mode;
    if (gold) state.gold = gold;
    if (message) state.message = message;
    if (speed) state.speed = speed;
    if (delay) state.delay = delay;

    // Ghi log vào MongoDB
    try {
      const logs = await connectDB();
      await logs.insertOne({
        timestamp: new Date(),
        event_type: mode === "auto" ? "update_auto" : "update_manual",
        mode: state.mode,
        gold: state.gold,
        message: state.message,
        speed: state.speed,
        delay: state.delay,
      });
    } catch (err) {
      console.error("Lỗi ghi log:", err);
    }

    return res.status(200).json({ success: true, state });
  }

  if (req.method === "GET") {
    return res.status(200).json(state);
  }

  return res.status(405).json({ error: "Method Not Allowed" });
}
