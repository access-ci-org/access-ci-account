import {
  HeadContent,
  Outlet,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";

import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";

import type { QueryClient } from "@tanstack/react-query";
import { Provider, useAtomValue } from "jotai";
import { isLoggedInAtom, store } from "@/helpers/state";

import { Footer, Header, UniversalMenus } from "@access-ci/ui/react";
import { NotificationsBar } from "@/components/notifications";
import Breadcrumbs from "@/components/breadcrumbs";

interface MyRouterContext {
  queryClient: QueryClient;
}

const Menus = () => {
  const isLoggedIn = useAtomValue(isLoggedInAtom);
  return (
    <UniversalMenus
      loginUrl={`${import.meta.env.BASE_URL}/login`}
      logoutUrl={`${import.meta.env.BASE_URL}/logout`}
      isLoggedIn={isLoggedIn}
    />
  );
};

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
