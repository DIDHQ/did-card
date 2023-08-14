export async function fetchJSON<T>(url: string): Promise<T> {
  const response = await fetch(url)
  if (response.ok) {
    return response.json() as T
  }
  throw new Error(response.statusText)
}
