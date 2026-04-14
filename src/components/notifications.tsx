"use client";

import * as React from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { notificationsAtom, dismissNotificationAtom } from "@/helpers/state";
import type { AppNotification } from "@/helpers/types";

import { X } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

function notificationToAlertVariant(
  variant: AppNotification["variant"],
): "success" | "error" | "warning" | "info" {
  switch (variant) {
    case "success":
      return "success";
    case "error":
      return "error";
    case "warning":
      return "warning";
    case "info":
    default:
      return "info";
  }
}

export function NotificationsBar() {
  const notifications = useAtomValue(notificationsAtom);
  const dismiss = useSetAtom(dismissNotificationAtom);

  React.useEffect(() => {
    const timers = notifications
      .filter((n) => n.autoCloseMs && n.autoCloseMs > 0)
      .map((n) => setTimeout(() => dismiss(n.id), n.autoCloseMs as number));

    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [notifications, dismiss]);

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      <div className="space-y-2">
        {notifications.map((n) => (
          <Alert
            key={n.id}
            variant={notificationToAlertVariant(n.variant)}
            role="status"
            aria-live="polite"
            className="relative pr-14"
          >
            {n.title ? <AlertTitle>{n.title}</AlertTitle> : null}

            <AlertDescription className={cn(!n.title && "pt-0")}>
              {n.message}
            </AlertDescription>

            {n.dismissible !== false ? (
              <button
                type="button"
                onClick={() => dismiss(n.id)}
                className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-black/5"
                aria-label="Dismiss notification"
              >
                <X className="h-4 w-4" />
              </button>
            ) : null}
          </Alert>
        ))}
      </div>
    </div>
  );
}