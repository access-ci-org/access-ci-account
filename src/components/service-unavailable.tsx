import { ErrorComponent, type ErrorComponentProps } from "@tanstack/react-router";
import { Wrench } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Thrown from route loaders when the API reports that a backend service (e.g.
// CoManage Registry) is down. Without this, loaders treat every API error as an
// auth failure and redirect to /login, which bounces straight back through SSO
// and reloads the page endlessly during an outage.
export class ServiceUnavailableError extends Error {
  constructor() {
    super("Service unavailable");
    this.name = "ServiceUnavailableError";
  }
}

export function ServiceUnavailable() {
  return (
    <Alert variant="warning" role="alert">
      <Wrench />
      <AlertTitle>Down for Maintenance</AlertTitle>
      <AlertDescription>
        ACCESS account services are temporarily unavailable while we perform
        maintenance. Please try again later.
      </AlertDescription>
    </Alert>
  );
}

export function RouteErrorComponent(props: ErrorComponentProps) {
  return props.error instanceof ServiceUnavailableError ? (
    <ServiceUnavailable />
  ) : (
    <ErrorComponent {...props} />
  );
}
