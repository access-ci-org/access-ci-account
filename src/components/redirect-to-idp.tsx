import { useEffect, useState } from "react";
import { useSetAtom } from "jotai";
import { oidcAuthorizeAtom } from "@/helpers/state";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import HelpTicketLink from "@/components/help-ticket-link";

const COUNTDOWN_SECONDS = 20;

export default function RedirectToIdp({
  idpName,
  idpHint,
}: {
  idpName: string;
  idpHint: string;
}) {
  const [secondsRemaining, setSecondsRemaining] = useState(COUNTDOWN_SECONDS);
  const oidcAuthorize = useSetAtom(oidcAuthorizeAtom);

  useEffect(() => {
    if (secondsRemaining <= 0) {
      oidcAuthorize("link", idpHint);
      return;
    }

    const timer = setTimeout(() => setSecondsRemaining((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsRemaining, oidcAuthorize, idpHint]);

  return (
    <Card className="w-full">
      <CardContent>
        <p>
          Please sign in to {idpName} to continue. If you have trouble signing
          in, please <HelpTicketLink />.
        </p>
        <p>
          You will be redirected to {idpName} in {secondsRemaining} seconds...
        </p>
        <Button onClick={() => oidcAuthorize("link", idpHint)}>
          Continue to {idpName}
        </Button>
      </CardContent>
    </Card>
  );
}
