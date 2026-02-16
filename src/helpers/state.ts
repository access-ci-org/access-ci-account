import {
  apiBaseUrl,
  initEmail,
  initToken,
  initUsername,
  ssoCookieDomain,
  ssoCookieName,
  ssoCookiePath,
} from "@/config";
import { atom, createStore } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const store = createStore();

const fetchApiJson = async (
  relativeUrl: string,
  { body = null, method = "GET" }: { body: any; method: string } = {
    body: null,
    method: "GET",
  },
) => {
  const absoluteUrl = `${apiBaseUrl}${relativeUrl}`;
  const token = store.get(tokenAtom); // Gets JWT from Jotai global state instead of manually passing

  // JSON headers
  const headers = new Headers({
    accept: "application/json",
    "content-type": "application/json",
  });
  if (token) headers.set("Authorization", `Bearer ${token}`); // Authorization header is added if token exists

  const response = await fetch(absoluteUrl, {
    body: body ? JSON.stringify(body) : null,
    headers,
    method,
  });
  if (response.status < 200 || response.status > 299) {
    return { error: { status: response.status } };
  } else {
    try {
      return await response.json();
    } catch (error) {
      return { error: { message: error } };
    }
  }
};

if (initEmail) localStorage.setItem("email", JSON.stringify(initEmail));
if (initUsername)
  localStorage.setItem("username", JSON.stringify(initUsername));
if (initToken) localStorage.setItem("token", JSON.stringify(initToken));

export const emailAtom = atomWithStorage("email", "", undefined, {
  getOnInit: true,
});
export const usernameAtom = atomWithStorage("username", "", undefined, {
  getOnInit: true,
});
export const tokenAtom = atomWithStorage("token", "", undefined, {
  getOnInit: true,
});
export const logoutAtom = atom(null, (_get, set) => {
  set(emailAtom, "");
  set(usernameAtom, "");
  set(tokenAtom, "");
  document.cookie = `${ssoCookieName}=; Max-Age=0; Path=${ssoCookiePath}; Domain=${ssoCookieDomain};`;
});

export const otpAtom = atom("");
const otpSendStatusAtom = atom({ error: "", sent: false });
const otpVerifyStatusAtom = atom({ error: "", verified: false });
const accountUpdateStatusAtom = atom({ error: "", saved: false });

export const registrationFormAtom = atom({});

export const sendOtpAtom = atom(
  (get) => get(otpSendStatusAtom),
  async (get, set) => {
    const email = get(emailAtom);
    let status = { error: "Email address is not set.", sent: false };
    if (email) {
      const response = await fetchApiJson("/auth/send-otp", {
        method: "POST",
        body: { email },
      });
      if (response?.error) {
        status = {
          error:
            response.error === "number"
              ? "Verification code could not be sent. Please try again later."
              : response.error,
          sent: false,
        };
      } else {
        status = { error: "", sent: true };
      }
    }
    set(otpSendStatusAtom, status);
    return status;
  },
);

export const verifyOtpAtom = atom(
  (get) => get(otpVerifyStatusAtom),
  async (get, set) => {
    const email = get(emailAtom);
    const otp = get(otpAtom);

    let status = {
      error: "Email address or verification code are not set.",
      verified: false,
    };
    if (email && otp) {
      const response = await fetchApiJson("/auth/verify-otp", {
        method: "POST",
        body: { email, otp },
      });
      if (response?.error) {
        status = {
          error:
            typeof response.error === "number"
              ? "Verification code could not be checked. Please try again later."
              : response.error,
          verified: false,
        };
      } else {
        status = { error: "", verified: true }; // Check to make sure it has jwt
        set(tokenAtom, response.jwt);
      }
    }
    set(otpVerifyStatusAtom, status);
    return status;
  },
);

export const accountAtom = atom(async (get) => {
  return await fetchApiJson(`/account/${get(usernameAtom)}`);
});

export const updateAccountAtom = atom(
  (get) => get(accountUpdateStatusAtom),
  async (get, set, account) => {
    const response = await fetchApiJson(`/account/${get(usernameAtom)}`, {
      method: "POST",
      body: account,
    });

    const status = response?.error
      ? {
        error: response.error,
        saved: false,
      }
      : { error: "", saved: true };
    set(accountUpdateStatusAtom, status);
    return status;
  },
);

// API Type fields
export type CountryApi = { countryId: number; countryName: string };
export type AcademicStatusApi = { academicStatusId: number; name: string };
export type TermsAndConditionsApi = {
  id: string | number;
  description: string;
  url: string;
  body: string; // HTML string
};
// Backend responses from type fields
type CountriesResponse = {
  countries: CountryApi[];
};

type AcademicStatusesResponse = {
  academicStatuses: AcademicStatusApi[];
};

// Read-only Atoms for fetching data from the API
export const countriesAtom = atom(async (get) => {
  if (!get(tokenAtom)) return [];
  const response = (await fetchApiJson("/country")) as CountriesResponse;

  return response.countries || [];
});

export const academicStatusesAtom = atom(async (get) => {
  if (!get(tokenAtom)) return [];
  const response = (await fetchApiJson(
    "/academic-status",
  )) as AcademicStatusesResponse;

  return response.academicStatuses || [];
});

export const termsAndConditionsAtom = atom(async (get) => {
  if (!get(tokenAtom)) return null;
  const response = (await fetchApiJson("/terms-and-conditions")) as
    | TermsAndConditionsApi
    | { error: any };

  if ((response as any)?.error) return null;

  return response as TermsAndConditionsApi;
});

// Retrieving Domain information based on email address
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

// --------- Helper functions for Domain Atom ---------
// Pulls domain from email address
const getDomainFromEmail = (email: string) => {
  if (!email) return null;
  const email_parts = email.trim().toLowerCase().split("@");
  if (email_parts.length !== 2 || !email_parts[1]) return null;
  return email_parts[1];
};

// Domain lookup response
export type DomainResponse = {
  domain: string;
  organizations: Organization[];
  idps: Idp[];
  isEligible?: boolean;
};

export const domainAtom = atom(async (get) => {
  if (!get(tokenAtom)) return null;
  const email = get(emailAtom);
  const domain = getDomainFromEmail(email);
  if (!domain) return null;

  const response = (await fetchApiJson(`/domain/${domain}`)) as
    | DomainResponse
    | { error: { status: number; message: string } };
  // Handle backend errors
  if ((response as any).error) {
    const err = (response as any).error as {
      status?: number;
      message?: string;
    };
    const msg = (err?.message || "").toString();

    // Handle ineligible domain case - sends 400 error
    if (err?.status === 400 && msg.includes("Ineligible domain")) {
      return {
        domain,
        organizations: [],
        idps: [],
        isEligible: false,
      } as DomainResponse;
    }
    return null; // For all other errors return null
  }

  // Success path: non-400 response
  const data = response as DomainResponse;
  const rawOrgs = data.organizations || [];
  const filteredOrgs = rawOrgs.filter((o) => o.isActive && o.isEligible === true);

  // Domain is considered eligible if... 
  const isEligible = rawOrgs.length === 0 || filteredOrgs.length > 0;

  return {
    domain: data.domain,
    organizations: filteredOrgs || [],
    idps: data.idps || [],
    isEligible,
  };
});