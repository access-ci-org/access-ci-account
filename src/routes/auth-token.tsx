import {
  createFileRoute,
  useNavigate,
  useSearch,
} from "@tanstack/react-router";
import { siteTitle } from "@/config";
import { z } from "zod";
import { useSetAtom, useAtomValue } from "jotai";
import { registrationFormAtom, tokenAtom, usernameAtom, ciLogonTokenAtom } from "@/helpers/state";
import { parseJwt } from "@/helpers/jwt";
import { useEffect } from "react";
import { LoaderCircle } from "lucide-react";

// Define the search schema
const searchSchema = z.object({
  jwt: z.jwt(),
  first_name: z.string(),
  last_name: z.string(),
  token_type: z.string().optional(),
});

export const Route = createFileRoute("/auth-token")({
  component: AuthToken,
  head: () => ({ meta: [{ title: `Complete Login | ${siteTitle}` }] }),
  validateSearch: searchSchema.parse,
});

function AuthToken() {
  const {
    jwt,
    first_name: firstName,
    last_name: lastName,
    token_type: tokenType
  } = useSearch({ from: "/auth-token" });
  const navigate = useNavigate();
  const setToken = useSetAtom(tokenAtom);
  const setUsername = useSetAtom(usernameAtom);
  const setRegistrationForm = useSetAtom(registrationFormAtom);
  const setCiLogonToken = useSetAtom(ciLogonTokenAtom);
  const currentToken = useAtomValue(tokenAtom);

  useEffect(() => {
      if (tokenType === "cilogon") {
        setCiLogonToken(jwt); // set token 
        const currentPayload = parseJwt(currentToken);
        const currentType = currentPayload?.type;
  
        if (currentType === "otp") { // if type otp, user registers with an existing identity
          navigate({ to: "/register/complete" });
          return;
        }
  
        if (currentType === "login") { // if type login, user is linking a new identity
          navigate({ to: "/profile" });
          return;
        }
  
        navigate({ to: "/dashboard" });
        return;
      }
  
    const payload = parseJwt(jwt);
    setUsername(payload?.uid ?? "");
    setToken(jwt);
    setRegistrationForm({ firstName, lastName });

    navigate({ to: "/dashboard" });
  }, []);
  return <LoaderCircle className="animate-spin" />;
}
