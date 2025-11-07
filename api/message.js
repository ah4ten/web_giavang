let cache = {
  mode: "auto", // hoặc "manual"
  message: { type: "gold", text: "VANG MIENG SJC" },
};

export const config = { runtime: "edge" };

export default async function handler(req) {
  if (req.method === "POST") {
    const body = await req.json();
    if (body.mode) cache.mode = body.mode;
    if (body.message) cache.message = body.message;
    cache.time = new Date().toISOString();
    return new Response(JSON.stringify({ status: "ok", message: cache }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify(cache), {
    headers: { "Content-Type": "application/json" },
  });
}
