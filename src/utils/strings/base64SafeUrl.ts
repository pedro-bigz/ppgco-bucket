export function base64SafeUrl(encoded: string) {
  return encoded.replace(/\//g, '_').replace(/\+/g, '-').replace(/==$/, '');
}
