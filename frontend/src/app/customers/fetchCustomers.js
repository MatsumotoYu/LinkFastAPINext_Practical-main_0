export default async function fetchCustomers() {
  console.log("check:",process.env.NEXT_PUBLIC_API_ENDPOINT);
  const res = await fetch(
    process.env.NEXT_PUBLIC_API_ENDPOINT + "/allcustomers",
    {
      cache: "no-cache",
    }
  );
  if (!res.ok) {
    throw new Error("Failed to fetch customers");
  }

  const json = await res.json();

  // ここで構造を確認
 // console.log("API response:", json);

  // たとえば { data: [...] } の形式だった場合
  return json.data || json;
}
