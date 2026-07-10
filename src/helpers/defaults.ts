import type { PasswordFields, RegistrationFields } from "@/helpers/types";

export const passwordDefaultValues: PasswordFields = {
  password: "",
  confirmPassword: "",
};

export const registrationDefaultValues: RegistrationFields = {
  firstName: "",
  lastName: "",
  email: "",
  organizationId: 0,
  academicStatusId: 0,
  residenceCountryId: 0,
  citizenshipCountryIds: [] as number[],
  department: "",
  degrees: [],
};

export const profileDefaultValues = {
  username: "",
  ...registrationDefaultValues,
  role: [] as string[],
  timeZone: "",
};
