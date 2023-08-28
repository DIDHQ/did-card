export async function fetchJSON<T>(
  url: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(url, init)
  if (response.ok) {
    return response.json() as T
  }
  throw new Error(response.statusText)
}
