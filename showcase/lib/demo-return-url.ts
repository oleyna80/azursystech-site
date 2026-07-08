export function getDemoReturnHref() {
  const baseUrl =
    process.env.NEXT_PUBLIC_WEB_BASE_URL ??
    (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '')

  return `${baseUrl}/fr#websites`
}
