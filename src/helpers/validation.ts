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

  first_name: requiredString("First name"),
  last_name: requiredString("Last name"),
  institution: requiredString("Institution"),
  academic_status: requiredString("Academic status"),
  residence_country: requiredString("Country of residence"),
  citizenship_country: requiredString("Country of citizenship"),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;