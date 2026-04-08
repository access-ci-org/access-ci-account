import type { MouseEvent } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAtomValue, useSetAtom } from "jotai";
import {
  adminUsernameAtom,
  impersonateAtom,
  isAdminAtom,
  isImpersonatingAtom,
  isLoggedInAtom,
  pushNotificationAtom,
  stopImpersonatingAtom,
} from "@/helpers/state";

import {
  UniversalMenus,
  loginMenuItem,
  myAccessMenuItem,
  universalMenuItems,
} from "@access-ci/ui/react";

export const Menus = () => {
  const adminUsername = useAtomValue(adminUsernameAtom);
  const impersonate = useSetAtom(impersonateAtom);
  const isAdmin = useAtomValue(isAdminAtom);
  const isImpersonating = useAtomValue(isImpersonatingAtom);
  const isLoggedIn = useAtomValue(isLoggedInAtom);
  const stopImpersonating = useSetAtom(stopImpersonatingAtom);
  const pushNotification = useSetAtom(pushNotificationAtom);
  const navigate = useNavigate();

  const lastItemSource = isLoggedIn ? myAccessMenuItem : loginMenuItem;
  const lastItem = {
    ...lastItemSource,
    items: [...(lastItemSource.items || [])],
  };

  const navigateClickHandler =
    (route: string) => (e: MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      navigate({ to: route });
    };

  if (isLoggedIn) {
    if (isAdmin && !isImpersonating)
      lastItem.items.unshift({
        name: "Impersonate user...",
        onClick: () => {
          const targetUsername = prompt("Enter the ACCESS ID to impersonate:");
          if (targetUsername)
            (async () => {
              const account = await impersonate(targetUsername);
              if (account && "error" in account) {
                pushNotification({
                  id: "impersonate",
                  title: "Error Impersonating",
                  message:
                    account.error.status === 404
                      ? `ACCESS ID ${targetUsername} does not exist.`
                      : `An error occurred while attempting to impersonate ${targetUsername}.`,
                  variant: "error",
                });
                await stopImpersonating();
              } else {
                pushNotification({
                  id: "impersonate",
                  title: "Now Impersonating",
                  message: `You are now impersonating ${targetUsername}.`,
                  variant: "warning",
                });
              }

              navigate({ to: "/" });
            })();
        },
      });
    lastItem.items[lastItem.items.length - 1] = isImpersonating
      ? {
          name: "Stop Impersonating",
          onClick: () =>
            (async () => {
              await stopImpersonating();
              pushNotification({
                id: "impersonate",
                title: "Stopped Impersonating",
                message: `You have stopped impersonating and are now acting as ${adminUsername}.`,
                variant: "success",
              });
              navigate({ to: "/" });
            })(),
        }
      : {
          name: "Log out",
          href: "/logout",
          onClick: navigateClickHandler("/logout"),
        };
  } else {
    lastItem.items[0] = {
      name: "Login",
      href: "/login",
      onClick: navigateClickHandler("/login"),
    };
  }

  return <UniversalMenus items={[...universalMenuItems, lastItem]} />;
};
