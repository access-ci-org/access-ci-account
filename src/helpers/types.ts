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

export type RefreshResponse = {
  accessToken: string;
  refreshToken: string;
};

export type RegistrationForm = {
  firstName: string;
  lastName: string;
  email: string;
  organizationId: number;
  academicStatusId: number;
  residenceCountryId: number;
  citizenshipCountryIds: number[];
  department: string | null;
};

export type AccountResponse = RegistrationForm & {
  academicDegrees: { degreeId: number; degreeField: string }[];
  timeZone: string;
  role: string[];
};

export type CreateAccountResponse = {
  success: boolean;
  access_id: string;
};
