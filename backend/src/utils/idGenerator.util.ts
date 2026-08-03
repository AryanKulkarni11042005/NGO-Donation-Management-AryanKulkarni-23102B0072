export function generateTransactionId(): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const random = Math.random().toString(36).slice(2, 10).toUpperCase();
  return `TXN-${date}-${random}`;
}
