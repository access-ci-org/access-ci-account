import {
  HeadContent,
  Outlet,
  createRootRouteWithContext,
  useNavigate,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { useEffect } from "react";

import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";

import type { QueryClient } from "@tanstack/react-query";
import { Provider } from "jotai";
import { store } from "@/helpers/state";

import { Footer, Header } from "@access-ci/ui/react";
import { NotificationsBar } from "@/components/notifications";
import Breadcrumbs from "@/components/breadcrumbs";
import { Menus } from "@/components/menus";
import { hasSsoCookie } from "@/helpers/cookies";

interface MyRouterContext {
  queryClient: QueryClient;
}

function SsoRedirectHandler() {
  const navigate = useNavigate();

  useEffect(() => {
    const path = window.location.pathname;
    const isLoginRoute = path === "/login";
    const isAuthTokenRoute = path === "/auth-token";

    if (hasSsoCookie() && !isLoginRoute && !isAuthTokenRoute) {
      navigate({ to: "/login" });
    }
  }, [navigate]);

  return null;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <Provider store={store}>
      <HeadContent />
      <SsoRedirectHandler />
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