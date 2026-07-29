import { Pencil } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function EmailToken({
  email,
  label,
  primaryActionLabel,
  onPrimaryAction,
  onDelete,
}: {
  email: string;
  label: "Primary" | "Recovery";
  primaryActionLabel?: string;
  onPrimaryAction?: () => void;
  onDelete?: () => void;
}) {
  // The menu (and its actions) only appears once there's something to do —
  // a lone email address can neither be demoted/deleted nor promoted.
  const hasMenu = !!onPrimaryAction || !!onDelete;

  return (
    <span className="inline-flex max-w-full items-stretch border border-[var(--teal-700)] text-sm">
      <span className="flex shrink-0 items-center bg-[var(--teal-700)] px-2 text-white">
        <span className="text-xs font-bold uppercase">{label}</span>
      </span>
      <span className="flex items-center gap-1 bg-white px-3 py-1.5">
        <span className="truncate break-all">{email}</span>
        {hasMenu && (
          <DropdownMenu>
            <DropdownMenuTrigger
              className="inline-flex h-5 w-5 shrink-0 items-center justify-center text-[var(--teal-700)] hover:opacity-70"
              aria-label={`Options for ${email}`}
            >
              <Pencil className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onPrimaryAction && (
                <DropdownMenuItem onSelect={onPrimaryAction}>
                  {primaryActionLabel}
                </DropdownMenuItem>
              )}
              {onDelete && (
                <DropdownMenuItem variant="destructive" onSelect={onDelete}>
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </span>
    </span>
  );
}
