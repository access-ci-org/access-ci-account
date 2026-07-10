import type { ReactNode } from "react";

export type AcademicStatusesResponse = {
  academicStatuses: { academicStatusId: number; name: string }[];
};

export type ApiError = {
  error: {
    status?: number;
    message: string;
  };
};

export type SuccessResponse = {
  success: boolean;
};

export type TermsAndConditionsResponse = {
  id: string | number;
  description: string;
  url: string;
  body: string; // HTML string
};

export type SshKeyResponse = {
  sshKeys: { keyId: number; hash: string; created: string }[];
};

// Backend responses from type fields
export type CountriesResponse = {
  countries: { countryId: number; name: string }[];
};

export type DegreesResponse = {
  degrees: { degreeId: number; name: string }[];
};

export type DomainResponse = {
  domain: string;
  organizations: Organization[];
  idps: Idp[];
  isEligible?: boolean;
};

export type Idp = {
  displayName: string;
  entityId: string;
};

export type CarnegieCategory = {
  category_id: number;
  category: string;
  display_category: string;
  relative_order: number;
  description: string | null;
  is_active: boolean;
};

export type Organization = {
  organizationId: number;
  orgTypeId: number;
  organizationAbbrev: string | null;
  organizationName: string | null;
  organizationUrl: string | null;
  organizationPhone: string | null;
  nsfOrgCode: string | null;
  isReconciled: boolean;
  amieName: string | null;
  countryId: number | null;
  stateId: number | null;
  latitude: string | null;
  longitude: string | null;
  isMsi: boolean | null;
  isActive: boolean;
  isEligible: boolean | null;

  carnegieCategories: CarnegieCategory[];
  state: string | null;
  country: string | null;
  orgType: string | null;
  ignoreIdp: boolean | null;
};

export type IdentifierResponse = {
  type: string;
  identifier: string;
  login: boolean;
};

export type Identity = {
  identityId: number;
  organization: string | null;
  identifiers: IdentifierResponse[];
};

export type IdentityResponse = {
  identities: Identity[];
};

export type VerifyOtpResponse = {
  jwt: string;
};

export type FetchOptions = {
  accessToken?: string | null;
  body?: any;
  headers?: { [key: string]: string };
  method?: string;
  refreshToken?: string | null;
};

export type RegistrationFields = {
  firstName: string;
  lastName: string;
  email: string;
  organizationId: number;
  academicStatusId: number;
  residenceCountryId: number;
  citizenshipCountryIds: number[];
  department: string;
  degrees: Degree[];
};

export type PasswordFields = {
  password: string;
  confirmPassword: string;
};

export type Degree = { degreeId: number; degreeField: string };

export type BackupEmail = { email: string; verified: boolean };

// A single entry in the profile-update `emails` list. `otpToken` is only needed
// for an address that is new to the account.
export type EmailEntry = { email: string; primary: boolean; otpToken?: string };

export type AccountResponse = RegistrationFields & {
  backupEmails: BackupEmail[];
  degrees: Degree[];
  timeZone: string;
  role: string[];
  username: string;
};

export type CreateAccountResponse = {
  success: boolean;
  access_id: string;
};

// Option type defines selectable options for form fields
export type Option<T> = { label: string; value: T };

export type NotificationType = "success" | "error" | "info" | "warning";

export type AppNotification = {
  id: string;
  title?: string;
  message: string | ReactNode;
  variant?: NotificationType;
  dismissible?: boolean;
  autoCloseMs?: number; // time in milliseconds to auto close the notification
};

export type OidcClientType = "link" | "login";

export type OidcClientIds = {
  link: string;
  login: string;
};

export type OidcInfoResponse = {
  authorizationUrl: string;
  clientIds: OidcClientIds;
};

export type RefreshResponse = {
  accessToken: string;
  refreshToken: string;
};

export type OidcTokensResponse = RefreshResponse & {
  idToken?: string | null;
  isAdmin?: boolean | null;
};

export type CreateAccountStatus = {
  error: string;
  created: boolean;
  username: string;
  idp: string;
};
