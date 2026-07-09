export function getErrorMessage(error, fallback = "Something went wrong. Please try again.") {
  if (!error?.response) {
    if (error?.message === "Network Error") {
      return "Can't reach the server. Check your connection and try again."
    }
    return fallback
  }

  const data = error.response.data
  if (!data) return fallback
  if (typeof data === "string") return data
  if (data.detail) return data.detail
  if (Array.isArray(data)) return data.join(" ")

  const values = Object.values(data).flat().filter(Boolean)
  return values.length ? values.join(" ") : fallback
}