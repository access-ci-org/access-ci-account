import { createFileRoute } from "@tanstack/react-router";
import * as z from "zod";
import { useAppForm } from "@/hooks/form";
import { siteTitle } from "@/config";
import PasswordForm from "@/components/password-change-form";

export const Route = createFileRoute("/password")({
  component: Password,
  head: () => ({ meta: [{ title: `Change Password | ${siteTitle}` }] }),
});

const CHARACTERS: string[] = [
  "abcdefghijklmnopqrstuvwxyz",
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  "0123456789",
  "! @#$%^&*()-_+={}[]|\\;:<>,./?"
];

const MIN_LENGTH = 12;
const MAX_LENGTH = 64;
const MIN_CLASSES = 3;
const MIN_CHARACTERS_PER_CLASS = 1;

type PasswordPolicy = {
  minLength: number;
  maxLength: number;
  characterClasses: string[];
  minClasses: number;
  minCharactersPerClass: number;
};

const DEFAULT_PASSWORD_POLICY: PasswordPolicy = {
  minLength: MIN_LENGTH,
  maxLength: MAX_LENGTH,
  characterClasses: CHARACTERS,
  minClasses: MIN_CLASSES,
  minCharactersPerClass: MIN_CHARACTERS_PER_CLASS,
};

function validatePassword(
  password: string,
  policy: PasswordPolicy = DEFAULT_PASSWORD_POLICY,
): string[] {
  const errors: string[] = [];

  // Length rule: between min and max
  if (password.length < policy.minLength || password.length > policy.maxLength) {
    errors.push(
      `Your new password must be between ${policy.minLength} and ${policy.maxLength} characters in length.`,
    );
  }

  // Character class rule
  if (policy.minClasses > 0 && policy.minCharactersPerClass > 0) {
    // Convert password to a Set so duplicates are ignored
    const passwordSet = new Set([...password]);

    // Group characters into sets for each class (ie. lowercase, uppercase, etc.)
    const classSets = policy.characterClasses.map((chars) => new Set([...chars]));
    
    // Count how many characters from the password are in each specific class
    const charsPerSet = classSets.map((classSet) => {
      let count = 0;
      for (const ch of passwordSet) {
        if (classSet.has(ch)) count += 1;
      }
      return count;
    });

    // Count how many character classes meet the minimum requirement
    const validSets = charsPerSet.filter((n) => n >= policy.minCharactersPerClass)
      .length;

    if (validSets < policy.minClasses) {
      errors.push(
        "Your new password must include characters from three of the following: lowercase letters, uppercase letters, numbers, and symbols.",
      );
    }
  }

  return errors;
}

const strongPasswordSchema = z.string().superRefine((password, ctx) => {
  const errors = validatePassword(password);
  for (const message of errors) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message });
  }
});

const registrationSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: strongPasswordSchema,
  repeatedNewPassword: z.string().min(1, "Please re-enter your new password"),
  // Check if currentPassword is different from newPassword
}).refine((data) => data.currentPassword !== data.newPassword, {
  message: "New password must be different from current password",
  path: ["newPassword"], // Shows error on the newPassword field
}) .refine((data) => data.newPassword === data.repeatedNewPassword, {
  message: "Passwords don't match",
  path: ["repeatedNewPassword"], // Shows error on the repeatedNewPassword field
});
// TODO Check if currentPassword is the same as database password, this may need to be done on the server side, but for now there are checks on the client side only.


function Password() {
  const form = useAppForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      repeatedNewPassword: "",
    },
    validators: {
      onSubmit: registrationSchema,
    },
    onSubmit: async ({ value }) => {
      console.log(value);
    },
  });

  return (
    <>
      <h1> Change ACCESS Password  </h1>
      <PasswordForm form={form} />
    </>
  );
}
