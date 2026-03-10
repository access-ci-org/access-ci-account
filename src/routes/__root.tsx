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

import { Footer, Header } from "@access-ci/ui/react";
import { NotificationsBar } from "@/components/notifications";
import Breadcrumbs from "@/components/breadcrumbs";
import { Menus } from "@/components/menus";

interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <Provider store={store}>
      <HeadContent />
      <Menus />
      <Header />
      <Breadcrumbs />
      <div className="container mt-15! mb-30!">
        <NotificationsBar />
        <Outlet />
      </div>
      <Footer />
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
