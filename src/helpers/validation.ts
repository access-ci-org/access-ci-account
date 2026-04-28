// src/helpers/validation.ts
import * as z from "zod";
import { validatePassword } from "@/helpers/password";

const requiredString = (label: string) =>
  z
    .string(`${label} is required.`)
    .trim()
    .min(1, { message: `${label} is required.` });

const requiredNumber = (label: string) =>
  z
    .number(`${label} is required.`)
    .min(1, { message: `${label} is required.` });

export const strongPasswordSchema = z.string().superRefine((password, ctx) => {
  const errors = validatePassword(password);
  for (const message of errors) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message });
  }
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  password: strongPasswordSchema,
  confirmPassword: z.string().min(1, "Please re-enter your new password"),
  // Check if currentPassword is different from newPassword
}).refine((data) => data.currentPassword !== data.password, {
  message: "New password must be different from current password",
  path: ["password"], // Shows error on the newPassword field
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"], // Shows error on the repeatedNewPassword field
});
// TODO Check if currentPassword is the same as database password, this may need to be done on the server side, but for now there are checks on the client side only.

export const profileFormSchema = z.object({
  firstName: requiredString("First name"),
  lastName: requiredString("Last name"),
  email: z.string().email({ message: "Invalid email address." }),
  organizationId: requiredNumber("Institution"),
  academicStatusId: requiredNumber("Academic status"),
  residenceCountryId: requiredNumber("Country of residence"),

  citizenshipCountryIds: z
    .array(z.number())
    .min(1, { message: "At least one country of citizenship is required." }),

  role: z.array(z.string()).catch([]).optional(),

  degrees: z
    .array(
      z.object({
        degreeId: z.number().min(1, "Select a degree"),
        degreeField: z.string().min(1, "Enter a degree field"),
      }),
    )
    .catch([]).optional(),

  timeZone: z.string().catch("").optional(),
  department: requiredString("Department"),

  username: z.string(),
  password: strongPasswordSchema.optional(),
  confirmPassword: z.string().min(1, "Please confirm your password.")}).refine(
    (data) => !data.password || data.password === data.confirmPassword,
    {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    },
  );

export type ProfileFormValues = z.infer<typeof profileFormSchema>;

export const sshKeyFormSchema = z.object({
  sshKey: z.string().min(1, { message: "SSH Key is required." }),
});
