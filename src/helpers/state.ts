import {
  apiBaseUrl,
  ssoCookieDomain,
  ssoCookieName,
  ssoCookiePath,
} from "@/config";
import { atom, createStore } from "jotai";
import { atomWithStorage, loadable } from "jotai/utils";

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

  let response: Response;
  try {
    response = await fetch(absoluteUrl, {
      body: body ? JSON.stringify(body) : null,
      headers,
      method,
    });
  } catch (e) {
    // ✅ this is the big missing piece
    return { error: { message: "Network error", detail: String(e) } };
  }

  if (!response.ok) {
    // Optional improvement: capture FastAPI detail if present
    let detail: any = null;
    try {
      detail = await response.json();
    } catch {}
    return { error: { status: response.status, detail } };
  }

  try {
    return await response.json();
  } catch (error) {
    return { error: { message: "Invalid JSON response", detail: String(error) } };
  }
};

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
  const response = (await fetchApiJson("/country", {
    method: "GET", body: null,
  })) as CountriesResponse;

return response.countries || []
})

export const academicStatusesAtom = atom(async (get) => {
  if (!get(tokenAtom)) return [];
  const response = (await fetchApiJson("/academic-status", {
    method: "GET", body: null,
  })) as AcademicStatusesResponse;

  return response.academicStatuses || []
})

export const termsAndConditionsAtom = atom(async (get) => {
  if (!get(tokenAtom)) return null;
  const response = (await fetchApiJson("/terms-and-conditions", {
    method: "GET", body: null,
  })) as TermsAndConditionsApi | { error: any };

  if ((response as any)?.error) return null;

  return response as TermsAndConditionsApi;
});

export const termsAndConditionsLoadableAtom = loadable(termsAndConditionsAtom);
