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
// Notifcation Imports
import { NotificationsBar } from "@/components/notifications";
import { notificationsAtom } from "@/helpers/notification";
import { useSetAtom } from "jotai";

const StartRegistrationForm = withForm({
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
          message:
            params.get("message") ||
            "Email domain is ineligible for ACCESS.",
          autoCloseMs: 8000, // optional
        },
      ]);
    }
  }, [setNotifications]);
  defaultValues: {
    email: "",
  },
  render: function Render({ form }) {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <Card className="w-full max-w-lg my-5">
          <NotificationsBar />
          <CardHeader>
            <CardTitle>Start Registration</CardTitle>
            <CardDescription>
              Enter your university or work email address to start the
              registration process.
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
