import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { siteTitle } from "@/config";
import { useAppForm } from "@/hooks/form";
import * as z from "zod";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  domainAtom,
  emailAtom,
  otpAtom,
  pushNotificationAtom,
  saveProfileAtom,
  sendOtpAtom,
  store,
  usernameAtom,
  verifyIntentAtom,
  verifyOtpAtom,
} from "@/helpers/state";

import { Link } from "@tanstack/react-router";
import DomainValidationResponse from "@/components/domain-validation-response";
import HelpTicketLink from "@/components/help-ticket-link";
import RegistrationLayout from "@/components/registration-layout";
import FormVerifyEmail from "@/components/form-verify-email";

const flows = ["register", "profile", "password"] as const;
type Flow = (typeof flows)[number];

function isValidFlow(flow: string): flow is Flow {
  return flows.includes(flow as Flow);
}

const getPrevPath = (flow: Flow) =>
  `/${flow}` as "/register" | "/profile" | "/password";

export const Route = createFileRoute("/$flow/verify")({
  component: VerifyEmail,
  head: () => ({ meta: [{ title: `Verify Email Address | ${siteTitle}` }] }),
  beforeLoad: ({ params }) => {
    const { flow } = params;

    if (!isValidFlow(flow)) {
      throw redirect({ to: "/register" });
    }

    if (!store.get(sendOtpAtom).sent) {
      throw redirect({ to: getPrevPath(flow) });
    }
  },
});

const formSchema = z.object({
  otp: z.string().length(6, { message: "OTP code must be 6 characters." }),
});

function VerifyEmail() {
  const { flow: flowParam } = Route.useParams();

  if (!isValidFlow(flowParam)) {
    throw redirect({ to: "/register" });
  }

  const flow = flowParam;

  const [email, setEmail] = useAtom(emailAtom);
  const [otp, setOtp] = useAtom(otpAtom);
  const verifyOtp = useSetAtom(verifyOtpAtom);
  const pushNotification = useSetAtom(pushNotificationAtom);
  const saveProfile = useSetAtom(saveProfileAtom);
  const currentUsername = useAtomValue(usernameAtom);
  const verifyIntent = useAtomValue(verifyIntentAtom);
  const navigate = useNavigate();

  const prevPath = getPrevPath(flow);

  const nextPath =
    flow === "register"
      ? "/register/complete"
      : flow === "profile"
        ? "/"
        : "/password";

  const existingAccountPath = flow === "profile" ? "/profile" : "/";

  const form = useAppForm({
    defaultValues: {
      otp,
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      setOtp(value.otp);

      const status = await verifyOtp();

      setOtp("");

      if (!status.verified) {
        pushNotification({
          title: "Incorrect Code",
          message:
            "The verification code you entered did not match. Please try again.",
          variant: "error",
        });

        setEmail("");
        navigate({ to: prevPath });
        return;
      }

      // Profile flow: the verified address is a primary or recovery email for the
      // profile form. Recovery emails are exempt from eligibility, so there is no domain
      // gate here (primary eligibility is enforced at save via the organization).
      if (flow === "profile") {
        // Only block if the address belongs to a DIFFERENT ACCESS account; an
        // address that resolves to the user's own account is legitimate (e.g. one
        // of their existing emails) and must not be blocked.
        if (status.username && status.username !== currentUsername) {
          setEmail("");
          pushNotification({
            title: "Existing Account",
            message: (
              <>
                The email address {email} is already associated with ACCESS ID{" "}
                {status.username}. Please <HelpTicketLink /> if you have multiple
                ACCESS IDs and need to have them merged.
              </>
            ),
            variant: "error",
          });
          navigate({ to: existingAccountPath });
          return;
        }

        // The OTP token is now recorded (keyed by address) by verifyOtp. Either
        // commit the whole profile now (primary-email change) or return to the
        // profile form to keep editing (recovery email added).
        if (verifyIntent === "save") {
          await saveProfile();
          navigate({ to: nextPath });
        } else {
          navigate({ to: "/profile" });
        }
        return;
      }

      // Registration / password flows (unchanged).
      if (flow !== "password" && status.username) {
        setEmail("");

        pushNotification({
          title: "Existing Account",
          message: (
            <>
              You already have an ACCESS account. Your ACCESS ID is{" "}
              <strong>{status.username}</strong>. You can{" "}
              <Link to="/login">login</Link> or{" "}
              <a href="https://identity.access-ci.org/password-reset">
                reset your password
              </a>
              .
            </>
          ),
          variant: "error",
        });

        navigate({ to: existingAccountPath });
        return;
      }

      const domain = await store.get(domainAtom);
      const message = DomainValidationResponse({ domain });

      if (domain === null || !domain.isEligible) {
        pushNotification({
          variant: "error",
          title: "Ineligible Email Domain",
          message,
        });

        navigate({ to: prevPath });
        return;
      }

      if (domain.isEligible && !domain.organizations.length) {
        pushNotification({
          variant: "error",
          title: "Unknown Email Domain",
          message,
        });

        navigate({ to: prevPath });
        return;
      }

      navigate({ to: nextPath });
    },
  });

  const content = (
    <>
      <h1>Verify Email Address</h1>
      <p className="intro">
        Enter the 6-digit verification code sent to {email}.
      </p>
      <FormVerifyEmail form={form} />
    </>
  );

  if (flow === "register") {
    return <RegistrationLayout>{content}</RegistrationLayout>;
  }

  return content;
}