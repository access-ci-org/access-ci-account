import { withForm } from "@/hooks/form";
import { FieldGroup, FieldDescription } from "@/components/ui/field";
// Imports for API interaction

type PasswordFormInputsProps = {
    noIdenitity: boolean;
};

const PasswordFormInputs = withForm({
    defaultValues: {
        password: "",
        confirmPassword: "",
    },
    props: {
        noIdenitity: false,
    } as PasswordFormInputsProps,
    render: function Render({ form, noIdenitity }) {
        if (!noIdenitity) {
            return null;
        }

        return (
            <FieldGroup>
                {/* New Password field captures user's new password*/}
                <form.AppField
                    name="password"
                    children={(field) => (
                        <div className="flex flex-col">
                            <field.PasswordTextField
                                label="New Password"
                                placeholder="Please enter your new password."
                                required
                            />
                            <FieldDescription className="!mt-2 !text-xs leading-snug text-muted-foreground">
                                Your new password must be between 12 and 64 characters in length, and
                                include characters from three of the following: lowercase letters,
                                uppercase letters, numbers, and symbols. If you do not know your current
                                password, you can reset your password by email.
                            </FieldDescription>
                        </div>
                    )}
                />

                {/* Repeat New Password field captures user's new password, again, confirming */}
                <form.AppField
                    name="confirmPassword"
                    children={(field) => (
                        <field.PasswordTextField
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

export default PasswordFormInputs;
