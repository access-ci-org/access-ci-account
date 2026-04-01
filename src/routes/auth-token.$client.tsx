import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { siteTitle } from "@/config";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  registrationFormAtom,
  linkTokensAtom,
  loginTokensAtom,
  usernameAtom,
  isLoggedInAtom,
} from "@/helpers/state";
import { useEffect } from "react";
import { LoaderCircle } from "lucide-react";
import { popCookie } from "@/helpers/cookie";
import { pushNotificationAtom } from "@/helpers/notification";
import { parseJwt } from "@/helpers/jwt";

export const Route = createFileRoute("/auth-token/$client")({
  component: AuthToken,
  head: () => ({ meta: [{ title: `Complete Login | ${siteTitle}` }] }),
});

function AuthToken() {
  const { client } = Route.useParams();
  const navigate = useNavigate();
  const isLoggedIn = useAtomValue(isLoggedInAtom);
  const pushNotification = useSetAtom(pushNotificationAtom);
  const setLinkTokens = useSetAtom(linkTokensAtom);
  const setLoginTokens = useSetAtom(loginTokensAtom);
  const setUsername = useSetAtom(usernameAtom);
  const [registrationForm, setRegistrationForm] = useAtom(registrationFormAtom);

  useEffect(() => {
    const accessToken = popCookie("access_token");
    const refreshToken = popCookie("refresh_token");
    const idToken = popCookie("id_token");
    if (!accessToken || !refreshToken || !idToken) return;

    const userInfo = parseJwt(idToken);

    const loginError = (id: string, message: string) => {
      pushNotification({
        id,
        message,
        variant: "error",
      });
      navigate({ to: "/" });
    };

    (async () => {
      if (client === "link") {
        if (isLoggedIn) {
          // The user is linking a new account.
          // TODO: Link the account using the access token.
        } else {
          // The user is registering with an existing identity.
          if ("given_name" in userInfo && "family_name" in userInfo) {
            const { given_name: firstName, family_name: lastName } = userInfo;
            setRegistrationForm({ ...registrationForm, firstName, lastName });
          }
          setLinkTokens({ accessToken, refreshToken });
          navigate({ to: "/register/complete" });
        }
      } else if (client === "login") {
        // The user is logging in.
        if ("sub" in userInfo && userInfo.sub.endsWith("@access-ci.org")) {
          setUsername(userInfo.sub.replace("@access-ci.org", ""));
          setLoginTokens({ accessToken, refreshToken });
          navigate({ to: "/" });
        } else {
          loginError("invalid-subject", "Login failed due to invalid subject.");
        }
      } else {
        loginError("unknown-client", "Login failed due to unknown client.");
      }
    })();
  }, []);
  return <LoaderCircle className="animate-spin" />;
}
