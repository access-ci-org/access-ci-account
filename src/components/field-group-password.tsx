import { withFieldGroup } from "@/hooks/form";
import { FieldGroup } from "@/components/ui/field";
import { passwordDefaultValues } from "@/helpers/defaults";

export const FieldGroupPassword = withFieldGroup({
  defaultValues: passwordDefaultValues,
  render: function Render({ group }) {
    return (
      <FieldGroup>
        {/* Password field captures user's password*/}
        <group.AppField
          name="password"
          children={(field) => (
            <>
              <field.FieldPassword
                label="Password"
                placeholder="Please enter your new password."
                required
                description="Your new password must be between 12 and 64 characters in
                length, and include characters from three of the following:
                lowercase letters, uppercase letters, numbers, and symbols. If
                you do not know your current password, you can reset your
                password by email."
              />
            </>
          )}
        />

        {/* Repeat Password field captures user's password, again, confirming */}
        <group.AppField
          name="confirmPassword"
          children={(field) => (
            <field.FieldPassword
              label="Confirm Password"
              placeholder="Please enter your new password."
              required
            />
          )}
        />
      </FieldGroup>
    );
  },
});
