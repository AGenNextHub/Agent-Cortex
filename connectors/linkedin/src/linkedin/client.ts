export async function linkedInGet<T>(pathOrUrl: string, accessToken: string): Promise<T> {
  const url = pathOrUrl.startsWith("http") ? pathOrUrl : `https://api.linkedin.com${pathOrUrl}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "X-Restli-Protocol-Version": "2.0.0"
    }
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`LinkedIn GET failed: ${res.status} ${text}`);
  }

  return res.json() as Promise<T>;
}

export async function linkedInPost<T>(
  pathOrUrl: string,
  accessToken: string,
  payload: unknown
): Promise<T> {
  const url = pathOrUrl.startsWith("http") ? pathOrUrl : `https://api.linkedin.com${pathOrUrl}`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "X-Restli-Protocol-Version": "2.0.0"
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`LinkedIn POST failed: ${res.status} ${text}`);
  }

  if (res.status === 201 || res.status === 204) {
    return {} as T;
  }

  return res.json() as Promise<T>;
}
