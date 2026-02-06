"use client";

import * as React from "react";
import { useAtomValue, useSetAtom } from "jotai";
import {
    notificationsAtom,
    dismissNotificationAtom,
    type AppNotification,
} from "@/helpers/notification";

import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export function variantClasses(variant: AppNotification["variant"]) {
    switch (variant) {
        case "success":
            return "bg-green-50 border-green-200 text-green-950";
        case "error":
            return "bg-red-50 border-red-200 text-red-950";
        case "warning":
            return "bg-yellow-50 border-yellow-200 text-yellow-950";
        case "info":
        default:
            return "border-border bg-card text-card-foreground";
    }
}

export function NotificationsBar() {
    const notifications = useAtomValue(notificationsAtom);
    const dismiss = useSetAtom(dismissNotificationAtom);

    // Auto-dismiss notifications
    React.useEffect(() => {
        const timers = notifications
            .filter((n) => n.autoCloseMs && n.autoCloseMs > 0)
            .map((n) =>
                setTimeout(() => dismiss(n.id), n.autoCloseMs as number),
            );

        return () => timers.forEach((t) => window.clearTimeout(t));
    }, [notifications, dismiss]);

    if (notifications.length === 0) {
        return null;
    }

    return (
        <div className="w-full">
            <div className="mx-auto w-full max-w-5xl px-4 pt-4">
                <div className="space-y-2">
                    {notifications.map((n) => (
                        <div
                            key={n.id}
                            className={cn(
                                "relative rounded-xl border p-4 shadow-sm",
                                variantClasses(n.variant),
                            )}
                            role="status"
                            aria-live="polite"
                        >
                            <div className="pr-10">
                                {n.title ? (
                                    <div className="text-sm font-semibold">{n.title}</div>
                                ) : null}
                                <div className="text-sm">{n.message}</div>
                            </div>

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
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
