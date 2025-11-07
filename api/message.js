export default async function handler(req, res) {
  if (req.method === "POST") {
    const data = req.body;
    console.log("Dữ liệu nhận:", data);

    // Ví dụ gửi dữ liệu sang ESP32 qua IP cục bộ
    try {
      await fetch("http://192.168.1.xxx/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } catch (e) {
      console.error("Không gửi được đến ESP32:", e);
    }

    res.status(200).json({ status: "OK", received: data });
  } else {
    res.status(405).end();
  }
}
