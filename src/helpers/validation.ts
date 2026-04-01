// src/helpers/validation.ts
import * as z from "zod";

const requiredString = (label: string) =>
  z.string().min(1, { message: `${label} is required.` });

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

  academicDegrees: z
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
