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

import { Footer, Header, UniversalMenus } from "@access-ci/ui/react";
import { NotificationsBar } from "@/components/notifications";

interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <Provider store={store}>
      <HeadContent />
      <UniversalMenus
        loginUrl={`${import.meta.env.BASE_URL}/login`}
        logoutUrl={`${import.meta.env.BASE_URL}/logout`}
      />
      <Header />
      <div className="container mb-6!">
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
