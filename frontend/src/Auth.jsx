export function getToken() {
  return localStorage.getItem("token");
}

export async function fetchConToken(url, method = "GET", body = null) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);

  const res = await fetch(url, options);
  return res.json();
}
