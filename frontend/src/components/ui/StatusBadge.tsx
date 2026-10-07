const STYLES: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  verified: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full capitalize ${STYLES[status] ?? "bg-neutral-100 text-neutral-700"}`}>
      {status}
    </span>
  );
}
