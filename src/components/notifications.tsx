"use client";

import * as React from "react";
import { useAtomValue, useSetAtom } from "jotai";
import type { AnyRouter } from "@tanstack/react-router";
import {
  notificationsAtom,
  dismissNotificationAtom,
  navigationResolvedAtom,
  navigationStartedAtom,
  store as appStore,
} from "@/helpers/state";

import { X } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import HelpTicketLink from "@/components/help-ticket-link";
import type { AppNotification } from "@/helpers/types";

// Error messages from the API are plain text, so the API asks users to "open a
// help ticket" in words and the link is added here, matching the rest of the UI.
const HELP_TICKET_PHRASE = "open a help ticket";

function renderMessage(message: AppNotification["message"]) {
  if (typeof message !== "string") return message;
  const index = message.indexOf(HELP_TICKET_PHRASE);
  if (index === -1) return message;
  return (
    <>
      {message.slice(0, index)}
      <HelpTicketLink />
      {message.slice(index + HELP_TICKET_PHRASE.length)}
    </>
  );
}

// Clear notifications once the user moves to a different page, so a message
// about an earlier action isn't mistaken for one about the current page.
// onResolved fires once a navigation and any redirects it triggers settle.
export function subscribeNotificationsToRouter(
  router: AnyRouter,
  store = appStore,
) {
  const unsubscribeStart = router.subscribe("onBeforeLoad", () =>
    store.set(navigationStartedAtom),
  );
  const unsubscribeResolved = router.subscribe("onResolved", (event) => {
    // A route whose beforeLoad outlasts pendingMs (e.g. /auth-token waiting
    // on CILogon) first resolves on its pending spinner, then redirects as a
    // separate navigation. The user hasn't reached a page yet, so wait.
    if (router.state.matches.some((match) => match.status === "redirected"))
      return;
    store.set(navigationResolvedAtom, event.pathChanged);
  });
  return () => {
    unsubscribeStart();
    unsubscribeResolved();
  };
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
            variant={n.variant}
            // Errors interrupt screen readers so a new failure is announced.
            role={n.variant === "error" ? "alert" : "status"}
            aria-live={n.variant === "error" ? "assertive" : "polite"}
            className="pr-14"
          >
            {n.title ? <AlertTitle>{n.title}</AlertTitle> : null}

            <AlertDescription>{renderMessage(n.message)}</AlertDescription>

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