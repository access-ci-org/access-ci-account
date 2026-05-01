"use client";

import * as React from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { notificationsAtom, dismissNotificationAtom } from "@/helpers/state";

import { X } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

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
            variant={n.variant}
            role="status"
            aria-live="polite"
            className="pr-14"
          >
            {n.title ? <AlertTitle>{n.title}</AlertTitle> : null}

            <AlertDescription>{n.message}</AlertDescription>

            {n.dismissible !== false ? (
              <button
                type="button"
                onClick={() => dismiss(n.id)}
                className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center hover:bg-black/5"
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