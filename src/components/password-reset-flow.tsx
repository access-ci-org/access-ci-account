import { useState } from "react";
import * as z from "zod";
import { useAtom, useSetAtom } from "jotai";
import { useAppForm } from "@/hooks/form";

import {
  emailAtom,
  otpAtom,
  pushNotificationAtom,
  sendOtpAtom,
  verifyOtpAtom,
} from "@/helpers/state";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import FormVerifyEmail from "./form-verify-email";

const formSchema = z.object({
  otp: z.string().length(6, { message: "OTP code must be 6 characters." }),
});

export default function PasswordResetFlow() {
  const [email, setEmail] = useAtom(emailAtom);
  const [otp, setOtp] = useAtom(otpAtom);

  const sendOtp = useSetAtom(sendOtpAtom);
  const verifyOtp = useSetAtom(verifyOtpAtom);
  const pushNotification = useSetAtom(pushNotificationAtom);

  const [otpSent, setOtpSent] = useState(false);

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
        return;
      }

      pushNotification({
        title: "Email Verified",
        message: "You can now set a new password.",
        variant: "success",
      });
    },
  });

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await sendOtp();

    if (result.sent) {
      setOtpSent(true);
      pushNotification({
        title: "Verification Code Sent",
        message: `A verification code was sent to ${email}.`,
        variant: "success",
      });
    }
  };

  return (
    <>
      {!otpSent ? (
        <Card className="w-full mb-20">
          <CardHeader>
            <CardTitle>Reset your Password</CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSendOtp}>
              <FieldGroup>
                <Field>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                  />
                </Field>
              </FieldGroup>

              <CardFooter className="px-0 pt-6">
                <Button type="submit">Send Verification Code</Button>
              </CardFooter>
            </form>
          </CardContent>
        </Card>
      ) : (
        <>
          <p className="intro">
            Enter the 6-digit verification code sent to {email}.
          </p>
          <FormVerifyEmail form={form} />
        </>
      )}
    </>
  );
}
