// src/helpers/validation.ts
import * as z from "zod";

const requiredString = (label: string) =>
  z.string().min(1, { message: `${label} is required.` });

export const profileFormSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),

  role: z.array(z.string()).catch([]),

  degree: z.string().catch(""),
  degreeField: z.string().catch(""),
  timeZone: z.string().catch(""),

  firstName: requiredString("First name"),
  lastName: requiredString("Last name"),
  institution: requiredString("Institution"),
  academicStatus: requiredString("Academic status"),
  residenceCountry: requiredString("Country of residence"),
  citizenshipCountry: requiredString("Country of citizenship"),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;