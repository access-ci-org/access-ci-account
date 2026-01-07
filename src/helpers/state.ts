import { apiBaseUrl } from "@/config";
import { atom, createStore } from "jotai";

export const store = createStore();

export const fetchApiJson = async (
  relativeUrl: string,
  { body = null, method = "GET" }: { body: any; method: string },
) => {
  const absoluteUrl = `${apiBaseUrl}${relativeUrl}`;
  const token = store.get(tokenAtom); // Gets JWT from Jotai global state instead of manually passing

  const headers = new Headers({
    accept: "application/json",
    "content-type": "application/json",
  });
  if (token) headers.set("Authorization", `Bearer ${token}`); // Authorization header is added if token exists

  // JSON Headers
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

export const emailAtom = atom("");
export const otpAtom = atom("");
const otpSendStatusAtom = atom({ error: "", sent: false });
const otpVerifyStatusAtom = atom({ error: "", verified: false });
export const tokenAtom = atom("");

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
        console.log("Token set in verifyOtpAtom:", response.jwt);
      }
    }
    set(otpVerifyStatusAtom, status);
    return status;
  },
);

// API Type fields
export type CountryApi = { countryId: number; countryName: string };
export type AcademicStatusApi = { academicStatusId: number; name: string };

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