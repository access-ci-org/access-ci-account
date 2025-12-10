export default function RegistrationLayout({
  left,
  right,
}: {
  left: React.ReactNode;
  right: React.ReactNode;
}) {
  return (
    <div className="w-full flex flex-col md:flex-row justify-center gap-10 py-10">

      {/* LEFT COLUMN */}
      <div className="flex-1 flex justify-center">
        <div className="w-full max-w-xl">  {/* <-- Fixed shared width */}
          {left}
        </div>
      </div>

      {/* RIGHT COLUMN */}
      <div className="flex-1 flex justify-center">
        <div className="w-full max-w-xl">  {/* <-- Same width as left */}
          {right}
        </div>
      </div>

    </div>
  );
}
