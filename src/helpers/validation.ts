// src/helpers/validation.ts
import * as z from "zod";

const requiredString = (label: string) =>
  z.string().min(1, { message: `${label} is required.` });

const requiredNumber = (label: string) =>
  z.number().min(0, { message: `${label} is required.` });

export const profileFormSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),

  role: z.array(z.string()).catch([]),

  degree: z.string().catch(""),
  degreeField: z.string().catch(""),
  timeZone: z.string().catch(""),

  firstName: requiredString("First name"),
  lastName: requiredString("Last name"),
  institution: requiredNumber("Institution"),
  academicStatus: requiredNumber("Academic status"),
  residenceCountry: requiredNumber("Country of residence"),
  citizenshipCountryIds: z
    .array(z.number())
    .min(1, { message: "At least one country of citizenship is required." }),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;

export const sshKeyFormSchema = z.object({
  sshKey: z.string().min(1, { message: "SSH Key is required." })
});
