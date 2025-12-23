import {
  createFileRoute,
  useNavigate,
  useSearch,
} from "@tanstack/react-router";
import { siteTitle } from "@/config";
import { z } from "zod";
import { useSetAtom } from "jotai";
import { registrationFormAtom, tokenAtom, usernameAtom } from "@/helpers/state";
import { parseJwt } from "@/helpers/jwt";
import { useEffect } from "react";
import { LoaderCircle } from "lucide-react";

// Define the search schema
const searchSchema = z.object({
  jwt: z.jwt(),
  first_name: z.string(),
  last_name: z.string(),
});

export const Route = createFileRoute("/auth-token")({
  component: AuthToken,
  head: () => ({ meta: [{ title: `Complete Login | ${siteTitle}` }] }),
  validateSearch: searchSchema.parse,
});

function AuthToken() {
  const { jwt, first_name, last_name } = useSearch({ from: "/auth-token" });
  const navigate = useNavigate();
  const setToken = useSetAtom(tokenAtom);
  const setUsername = useSetAtom(usernameAtom);
  const setRegistrationForm = useSetAtom(registrationFormAtom);

  useEffect(() => {
    const payload = parseJwt(jwt);
    setUsername(payload?.uid ?? "");
    setToken(jwt);
    setRegistrationForm({ firstName: first_name, lastName: last_name });

    navigate({ to: "/dashboard" });
  }, []);
  return <LoaderCircle className="animate-spin" />;
}
