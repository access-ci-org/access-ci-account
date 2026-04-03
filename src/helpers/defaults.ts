import type { RegistrationForm } from "./types";

export const registrationFormDefault: RegistrationForm = {
  firstName: "",
  lastName: "",
  email: "",
  organizationId: 0,
  academicStatusId: 0,
  residenceCountryId: 0,
  citizenshipCountryIds: [] as number[],
};

export const profileFormDefault = {
  ...registrationFormDefault,
  role: [] as string[],
  degrees: [{ degreeId: 0, degreeField: "" }],
  timeZone: "",
};
