export function ipv4Url(url: string) {
  return url.replace('[::1]', 'localhost');
}
