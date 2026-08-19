export function generateTransactionId(): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const random = Math.random().toString(36).slice(2, 10).toUpperCase();
  return `TXN-${date}-${random}`;
}

export function generateCertificateCode(): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const random = Math.random().toString(36).slice(2, 10).toUpperCase();
  return `CERT-${date}-${random}`;
}

export function generateVerificationId(): string {
  const random = Math.random().toString(36).slice(2, 12).toUpperCase();
  return `VER-${random}`;
}
