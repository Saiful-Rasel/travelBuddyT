export async function refreshAccessToken() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/refresh-token`, {
    method: "POST",
    credentials: "include",
  });

  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Token refresh failed");
  return data.data.accessToken;
}

export async function getProtectedData() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/protected`, {
      method: "GET",
      credentials: "include",
    });
    if (res.status === 401) {
      await refreshAccessToken();
      const retryRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/protected`, {
        method: "GET",
        credentials: "include",
      });
      return await retryRes.json();
    }
    return await res.json();
  } catch (err) {
    throw err;
  }
}
