let currentState = {
  mode: "manual",
  message: "XIN CHAO QUY KHACH",
  gold: "SJC",
  speed: 50,
  delay: 3000,
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    currentState = req.body;
    console.log("Cap nhat:", currentState);
    return res.status(200).json({ status: "OK", message: "Cap nhat thanh cong" });
  }

  if (req.method === "GET") {
    return res.status(200).json({ state: currentState });
  }

  res.status(405).end();
}
