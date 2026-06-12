import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export default function Welcome() {
  return (
    <>
      <h1>ACCESS Account</h1>
      <p>
        Welcome to ACCESS! To get started, log in with your existing ACCESS
        account or register for a new account.
      </p>
      <div className="flex gap-2">
        <Button asChild>
          <Link to="/login">Login</Link>
        </Button>
        <Button asChild variant="secondary">
          <Link to="/register">Register</Link>
        </Button>
      </div>
      <ul className="mt-5! text-sm!">
        <li>
          <Link to="/password">Reset your ACCESS password</Link>
        </li>
        <li>
          <a href="https://identity.access-ci.org/">
            Other ACCESS ID questions
          </a>
        </li>
      </ul>
    </>
  );
}
