import { Button } from "@/components/ui/button";
import ProgressBar from "@/components/progress-bar";

export default function RegistrationLayout({
  children,
}: {
  children: React.ReactNode;
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
      <main>{children}</main>

      {/* Sidebar column */}
      <aside className="lg:pt-2">
        <ProgressBar />
        <Button asChild variant="secondary" className="mt-4">
          <a
            href="https://support.access-ci.org/help-ticket"
            target="_blank"
            rel="noreferrer"
          >
            Open a Help Ticket
          </a>
        </Button>
      </aside>
    </div>
  );
}
