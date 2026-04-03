// src/helpers/validation.ts
import * as z from "zod";

const requiredString = (label: string) =>
  z.preprocess( // gets raw value
    (value) => (value == null ? "" : value), // converts null/undefined to empty string 
    z.string().trim().min(1, { message: `${label} is required.` }), // check value
  );

const requiredNumber = (label: string) =>
  z.number().min(0, { message: `${label} is required.` });

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

  role: z.array(z.string()).catch([]),

  degrees: z
    .array(
      z.object({
        degreeId: z.number().min(1, "Select a degree"),
        degreeField: z.string().min(1, "Enter a degree field"),
      }),
    )
    .catch([]),

  timeZone: z.string().catch(""),
  department: requiredString("Department"),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;

export const sshKeyFormSchema = z.object({
  sshKey: z.string().min(1, { message: "SSH Key is required." }),
});
