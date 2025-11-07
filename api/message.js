let latest = { type: "gold", text: "VANG MIENG SJC" };

export default async function handler(req, res) {
  if (req.method === "POST") {
    const body = await req.json();
    latest = { type: body.type || "custom", text: body.text || latest.text };
    return res.json({ status: "ok", message: latest });
  }
  res.json({ message: latest });
}
