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

export const passwordSchema = z
  .object({
    password: strongPasswordSchema,
    confirmPassword: z.string().min(1, "Please re-enter your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const noPasswordSchema = z.object({
  password: z.string().catch(""),
  confirmPassword: z.string().catch(""),
});

export const profileFormSchema = z.object({
  firstName: requiredString("First name"),
  lastName: requiredString("Last name"),
  email: z.string().email({ message: "Invalid email address." }),
  organizationId: requiredNumber("Institution"),
  department: requiredString("Department"),
  academicStatusId: requiredNumber("Academic status"),
  residenceCountryId: requiredNumber("Country of residence"),

  citizenshipCountryIds: z
    .array(z.number())
    .min(1, { message: "At least one country of citizenship is required." }),

  role: z.array(z.string()).catch([]),

  degrees: z.array(
    z.object({
      degreeId: requiredNumber("Degree"),
      degreeField: requiredString("Degree field"),
    }),
  ),

  timeZone: z.string().catch(""),
});

export const usernameSchema = z.object({ username: z.string().catch("") });

export const sshKeyFormSchema = z.object({
  sshKey: z.string().min(1, { message: "SSH Key is required." }),
});

export const authTokenSchema = z.object({
  code: z.string(),
  state: z.string(),
});
