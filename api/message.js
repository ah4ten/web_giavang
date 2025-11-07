let state = {
  mode: "manual",   // "manual" hoặc "auto"
  message: "XIN CHAO QUY KHACH", 
  gold: "SJC",      // "SJC" hoặc "NHAN"
  speed: 50,        // 1-100 (100 là chậm nhất)
  delay: 3000,      // thời gian nghỉ giữa 2 vòng (ms)
  duration: 10000   // thời gian hiển thị 1 vòng (ms)
};

export default function handler(req, res) {
  if (req.method === "GET") {
    res.status(200).json({ state });
  } 
  else if (req.method === "POST") {
    try {
      const data = req.body;

      if (data.mode) state.mode = data.mode;
      if (data.message !== undefined) state.message = data.message;
      if (data.gold) state.gold = data.gold;
      if (data.speed !== undefined) state.speed = parseInt(data.speed);
      if (data.delay !== undefined) state.delay = parseInt(data.delay);
      if (data.duration !== undefined) state.duration = parseInt(data.duration);

      res.status(200).json({ success: true, state });
    } catch (err) {
      res.status(500).json({ error: "Loi xu ly du lieu", detail: err.message });
    }
  } 
  else {
    res.status(405).json({ error: "Phuong thuc khong duoc ho tro" });
  }
}
