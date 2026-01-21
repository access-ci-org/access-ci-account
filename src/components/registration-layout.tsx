export default function RegistrationLayout({
  left,
  right,
}: {
  left: React.ReactNode;
  right: React.ReactNode;
}) {
  return (
    <div
      className="
        w-full max-w-[1180px]
        grid grid-cols-1 gap-[20px]
        lg:grid-cols-[minmax(0,880px)_minmax(0,280px)]
        lg:items-start
      "
    >
      {/* Main column */}
      <div className="min-w-0">{left}</div>

      {/* Sidebar column */}
      <aside className="min-w-0 lg:pt-2">{right}</aside>
    </div>
  );
}
