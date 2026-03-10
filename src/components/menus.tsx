import type { MouseEvent } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
import { isLoggedInAtom } from "@/helpers/state";

import {
  UniversalMenus,
  loginMenuItem,
  myAccessMenuItem,
  universalMenuItems,
} from "@access-ci/ui/react";

const updateMenuItem = (
  items: typeof loginMenuItem.items,
  index: number,
  route: string,
  navigate: ReturnType<typeof useNavigate>,
) => {
  if (items) {
    items[index].href = `${import.meta.env.BASE_URL}${route}`;
    items[index].onClick = (e: MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      navigate({ to: route });
    };
  }
};

export const Menus = () => {
  const isLoggedIn = useAtomValue(isLoggedInAtom);
  const navigate = useNavigate();

  updateMenuItem(loginMenuItem.items, 0, "/login", navigate);
  updateMenuItem(
    myAccessMenuItem.items,
    myAccessMenuItem.items ? myAccessMenuItem.items.length - 1 : 0,
    "/logout",
    navigate,
  );

  return (
    <UniversalMenus
      items={[
        ...universalMenuItems,
        isLoggedIn ? myAccessMenuItem : loginMenuItem,
      ]}
    />
  );
};
