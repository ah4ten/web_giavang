let latest = "Xin chào từ web Vercel!";

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { text } = req.body;
    latest = text || latest;
    res.status(200).json({ status: "ok", message: latest });
  } else {
    res.status(200).json({ message: latest });
  }
}
