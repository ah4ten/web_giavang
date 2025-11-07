let currentMessage = { type: "gold", text: "SJC", speed: 50 };

export default function handler(req, res) {
  if (req.method === "POST") {
    currentMessage = req.body.message;
    return res.status(200).json({ success: true, message: currentMessage });
  }
  if (req.method === "GET") {
    return res.status(200).json({ message: currentMessage });
  }
  res.status(405).end();
}
