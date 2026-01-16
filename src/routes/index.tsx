import { createFileRoute } from "@tanstack/react-router";
import { siteTitle } from "@/config";

import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({ meta: [{ title: siteTitle }] }),
});

function Home() {
  return (
    <>
      <h1>ACCESS Account</h1>
      <p>This is a placeholder for the ACCESS account landing page.</p>
      <ul>
        <li>
          <Link to="/dashboard">My ACCESS Account dashboard</Link>
        </li>
        <li>
          <Link to="/register">Register for an account</Link>
        </li>
        <li>
          <Link to="/ssh-keys">Manage SSH Keys</Link>
        </li>
      </ul>
    </>
  );
}
