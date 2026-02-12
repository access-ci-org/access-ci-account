"use client";
import React from "react";
import { withForm } from "@/hooks/form";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup } from "@/components/ui/field";

import { notificationsAtom } from "@/helpers/notification";
import { useSetAtom } from "jotai";

const StartRegistrationForm = withForm({
  defaultValues: {
    email: "",
  },
  render: function Render({ form }) {
    const setNotifications = useSetAtom(notificationsAtom);

    React.useEffect(() => {
      const params = new URLSearchParams(window.location.search);

      if (params.get("error") === "ineligible_domain") {
        setNotifications((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            variant: "error",
            title: "Ineligible Email Domain",
            message: (
              <p className="!text-sm text-muted-foreground">
                We couldn’t find any organizations matching your email domain. Please open a help ticket{" "}
                <a
                  href="https://support.access-ci.org/"
                  target="_blank"
                  rel="noreferrer"
                  className="underline"
                >
                  here
                </a>{" "}
                to request that your organization be added.
              </p>
            ),
          },
        ]);
      }
    }, [setNotifications]);

    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <Card className="w-full max-w-lg my-5">
          <CardHeader>
            <CardTitle>Start Registration</CardTitle>
            <CardDescription>
              Enter your university or work email address to start the registration process.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <form.AppField
                name="email"
                children={(field) => (
                  <field.TextField
                    label="Email Address"
                    placeholder="University or work email address"
                  />
                )}
              />
            </FieldGroup>
          </CardContent>
          <CardFooter>
            <Field orientation="horizontal">
              <form.AppForm>
                <form.SubmitButton label="Continue" />
              </form.AppForm>
            </Field>
          </CardFooter>
        </Card>
      </form>
    );
  },
});

export default StartRegistrationForm;
