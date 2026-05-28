"use client";
import { withForm } from "@/hooks/form";
import type { ReactNode } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup } from "@/components/ui/field";

type FormSendOtpProps = {
  title?: string;
  description?: ReactNode;
  emailPlaceholder?: string;
  submitLabel?: string;
};

const defaultProps = {
  title: "Start Registration",
  description: "Enter your university or work email address to start the registration process.",
  emailPlaceholder: "University or work email address",
  submitLabel: "Continue",
};

const FormSendOtp = withForm({
  defaultValues: {
    email: "",
  },
  props: {} as FormSendOtpProps,
  render: function Render({
    form,
    title = defaultProps.title,
    description = defaultProps.description,
    emailPlaceholder = defaultProps.emailPlaceholder,
    submitLabel = defaultProps.submitLabel,
  }) {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <Card>
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <form.AppField
                name="email"
                children={(field) => (
                  <field.FieldText
                    label="Email Address"
                    placeholder={emailPlaceholder}
                    className="max-w-lg"
                  />
                )}
              />
            </FieldGroup>
          </CardContent>
          <CardFooter>
            <Field orientation="horizontal">
              <form.AppForm>
                <form.SubmitButton label={submitLabel} />
              </form.AppForm>
            </Field>
          </CardFooter>
        </Card>
      </form>
    );
  },
});

export default FormSendOtp;
