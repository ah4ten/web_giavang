// =======================
// api/message.js
// =======================
let state = {
  mode: "manual", // manual | auto
  message: { type: "gold", text: "VANG MIENG SJC" },
  autoData: {
    gold: "VANG MIENG SJC - Mua: 76.800 - Ban: 77.600",
    greet: "Chao mung quy khach!",
    env: "Nhiet do 28°C, do am 70%",
  },
};

export const config = { runtime: "edge" };

export default async function handler(req) {
  if (req.method === "POST") {
    const body = await req.json();

    // Chuyển đổi chế độ
    if (body.mode) {
      if (body.mode === "manual" || body.mode === "auto") {
        state.mode = body.mode;
      }
    }

    // Cập nhật nội dung thủ công (manual)
    if (state.mode === "manual" && body.message) {
      state.message = body.message;
    }

    // Cập nhật dữ liệu auto (nếu server lấy được)
    if (body.autoData) {
      state.autoData = { ...state.autoData, ...body.autoData };
    }

    return new Response(JSON.stringify({ status: "ok", state }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  // Gửi cho ESP32 hoặc client
  return new Response(JSON.stringify(state), {
    headers: { "Content-Type": "application/json" },
  });
}
