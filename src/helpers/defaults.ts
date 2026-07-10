import type {
  BackupEmail,
  PasswordFields,
  RegistrationFields,
} from "@/helpers/types";

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
};

export const profileDefaultValues = {
  username: "",
  ...registrationDefaultValues,
  backupEmails: [] as BackupEmail[],
  role: [] as string[],
  degrees: [{ degreeId: 0, degreeField: "" }],
  timeZone: "",
};
