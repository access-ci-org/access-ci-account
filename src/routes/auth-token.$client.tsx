import { createFileRoute, redirect } from "@tanstack/react-router";
import { siteTitle } from "@/config";
import {
  adminUsernameAtom,
  isLoggedInAtom,
  linkTokensAtom,
  loginTokensAtom,
  pushNotificationAtom,
  registrationFormAtom,
  usernameAtom,
  identityAddAtom,
  oidcStateAtom,
  oidcTokensAtom,
  store,
} from "@/helpers/state";
import { LoaderCircle } from "lucide-react";
import { parseJwt } from "@/helpers/jwt";
import { hasSsoCookie, setSsoCookie } from "@/helpers/cookie";
import { authTokenSchema } from "@/helpers/validation";
import type { OidcClientType } from "@/helpers/types";

export const Route = createFileRoute("/auth-token/$client")({
  component: AuthToken,
  head: () => ({ meta: [{ title: `Complete Login | ${siteTitle}` }] }),
  validateSearch: (search) => authTokenSchema.parse(search),
  beforeLoad: async ({ params, search }) => {
    const { client } = params;
    const { code, state } = search;

    const authError = (message: string) => {
      store.set(pushNotificationAtom, {
        id: "auth-error",
        message,
        variant: "error",
      });
      throw redirect({ to: "/" });
    };

    if (!["link", "login"].includes(client))
      return authError("Authentication failed due to unknown client.");

    const oidcState = store.get(oidcStateAtom);
    if (!state.length || !oidcState.length || state !== oidcState)
      return authError("Authentication failed due to invalid state.");

    const tokens = await store.set(
      oidcTokensAtom,
      client as OidcClientType,
      code,
    );
    if ("error" in tokens) return authError(tokens.error.message);

    const { accessToken, idToken, isAdmin, refreshToken } = tokens;
    const userInfo = parseJwt(idToken as string);

    if (client === "link") {
      if (store.get(isLoggedInAtom)) {
        // The user is linking a new account.
        store.set(linkTokensAtom, { accessToken, refreshToken });
        const { added } = await store.set(identityAddAtom);
        if (added) throw redirect({ to: "/linked-accounts" });
      } else {
        // The user is registering with an existing identity.
        if ("given_name" in userInfo && "family_name" in userInfo) {
          const { given_name: firstName, family_name: lastName } = userInfo;
          store.set(registrationFormAtom, {
            ...store.get(registrationFormAtom),
            firstName,
            lastName,
          });
        }
        store.set(linkTokensAtom, { accessToken, refreshToken });
        throw redirect({ to: "/register/complete" });
      }
    } else if (client === "login") {
      // The user is logging in.
      if ("sub" in userInfo && userInfo.sub.endsWith("@access-ci.org")) {
        if (!hasSsoCookie()) setSsoCookie();
        const username = userInfo.sub.replace("@access-ci.org", "");
        store.set(usernameAtom, username);
        if (isAdmin) store.set(adminUsernameAtom, username);
        store.set(loginTokensAtom, { accessToken, refreshToken });
        throw redirect({ to: "/" });
      } else {
        authError("Authentication failed due to invalid subject.");
      }
    }
  },
});

function AuthToken() {
  return <LoaderCircle className="animate-spin" />;
}
