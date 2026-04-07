import {
  HeadContent,
  Outlet,
  createRootRouteWithContext,
  useLocation,
  useNavigate,
} from "@tanstack/react-router";
import { useEffect } from "react";

import type { QueryClient } from "@tanstack/react-query";
import { Provider } from "jotai";
import { store } from "@/helpers/state";

import { Footer, Header } from "@access-ci/ui/react";
import { NotificationsBar } from "@/components/notifications";
import Breadcrumbs from "@/components/breadcrumbs";
import { Menus } from "@/components/menus";
import { hasSsoCookie } from "@/helpers/cookie";
import { isLoggedInAtom } from "@/helpers/state";
import { useAtomValue } from "jotai";

interface MyRouterContext {
  queryClient: QueryClient;
}

function SsoRedirectHandler() {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = useAtomValue(isLoggedInAtom);

  useEffect(() => {
    const path = location.pathname;

    const isLoginRoute = path === "/login";
    const isLogoutRoute = path === "/logout";
    const isAuthTokenRoute = path.startsWith("/auth-token/");

    // 🔑 KEY FIX: only redirect if NOT already logged in
    if (
      hasSsoCookie() &&
      !isLoggedIn &&
      !isLoginRoute &&
      !isLogoutRoute &&
      !isAuthTokenRoute
    ) {
      navigate({ to: "/login", replace: true });
    }
  }, [location.pathname, navigate, isLoggedIn]);

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
      <div className="container mt-15! mb-30! box-content">
        <NotificationsBar />
        <Outlet />
      </div>
      <Footer />
    </Provider>
  ),
});
