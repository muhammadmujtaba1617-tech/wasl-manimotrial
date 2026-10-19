export function getApiBaseUrl(): string {
  if (typeof window !== 'undefined') {
    if (process.env.NEXT_PUBLIC_API_URL) {
      return process.env.NEXT_PUBLIC_API_URL;
    }
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;
    return `${protocol}//${hostname}:4000`;
  }
  return 'http://localhost:4000';
}
