import {
  HeadContent,
  Outlet,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";

import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";

import type { QueryClient } from "@tanstack/react-query";
import { Provider } from "jotai";
import { store } from "@/helpers/state";

import { UniversalMenus } from "@access-ci/ui/react";

// Notifications
import { NotificationsBar } from "@/components/notifications";

interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <Provider store={store}>
      <HeadContent />
      <UniversalMenus />
      <div id="header"></div>
      <div className="container">
        <NotificationsBar />
        <Outlet />
      </div>
      <div id="footer"></div>
      <TanStackDevtools
        config={{
          position: "bottom-right",
        }}
        plugins={[
          {
            name: "Tanstack Router",
            render: <TanStackRouterDevtoolsPanel />,
          },
          TanStackQueryDevtools,
        ]}
      />
    </Provider>
  ),
});
