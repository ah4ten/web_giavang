export const config = { runtime: "edge" };

export default async function handler() {
  const api = "http://api.btmc.vn/api/BTMCAPI/getpricebtmc?key=3kd8ub1llcg9t45hnoh8hmn7t5kc2v";
  const res = await fetch(api);
  const data = await res.json();

  const result = {};
  for (const item of data.DataList.Data) {
    const name = item["@n_7"] || item["@n_4"];
    if (!name) continue;
    if (name.includes("SJC")) {
      result.sjc = {
        mua: item["@pb_7"],
        ban: item["@ps_7"],
      };
    }
    if (name.includes("NHẪN")) {
      result.nhan = {
        mua: item["@pb_4"],
        ban: item["@ps_4"],
      };
    }
  }

  return new Response(JSON.stringify(result), {
    headers: { "Content-Type": "application/json" },
  });
}
