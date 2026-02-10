import { createFileRoute } from "@tanstack/react-router";
import { siteTitle } from "@/config";

import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({ meta: [{ title: siteTitle }] }),
});

function Home() {
  return (
    <>
      <h1>ACCESS Account</h1>
      <p>
        Welcome to ACCESS! To get started, log in with your existing ACCESS
        account, or register for a new account.
      </p>
      <div className="flex gap-2">
        <Button asChild>
          <Link to="/login">Login</Link>
        </Button>
        <Button asChild variant="secondary">
          <Link to="/register">Register</Link>
        </Button>
      </div>
    </>
  );
}
