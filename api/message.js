// =======================
// api/message.js
// =======================

// Dùng biến toàn cục Vercel Edge Function có thể cache trong vài phút
let cache = { type: "gold", text: "VANG MIENG SJC" };

export const config = {
  runtime: "edge",
};

export default async function handler(req) {
  if (req.method === "POST") {
    const body = await req.json();
    cache = {
      type: body.type || "custom",
      text: body.text || cache.text,
      time: new Date().toISOString(),
    };
    return new Response(JSON.stringify({ status: "ok", message: cache }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ message: cache }), {
    headers: { "Content-Type": "application/json" },
  });
}
