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
import { atomWithRefresh, atomWithStorage } from "jotai/utils";
import { parseJwt } from "./jwt";
import {
  type ApiError,
  type SshKeyResponse,
  type AcademicStatusesResponse,
  type CountriesResponse,
  type DegreesResponse,
  type TermsAndConditionsResponse,
  type SuccessResponse,
  type DomainResponse,
  type VerifyOtpResponse,
  type FetchOptions,
  type RefreshResponse,
  type RegistrationData,
} from "./types";

export const store = createStore();

export const fetchJson = async <T extends object>(
  absoluteUrl: string,
  { accessToken, body, headers: extraHeaders, method }: FetchOptions = {},
): Promise<T | ApiError> => {
  const headers = new Headers({
    accept: "application/json",
    "content-type": "application/json",
    ...(extraHeaders || {}),
  });
  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  } else if (accessToken !== null) {
    return { error: { message: "Not authenticated" } };
  }

  const response = await fetch(absoluteUrl, {
    body: body ? JSON.stringify(body) : null,
    headers,
    method,
  });

  if (response.status < 200 || response.status > 299) {
    let errorText = "";
    try {
      errorText = (await response.json()).detail;
    } catch {
      errorText = await response.text();
    }
    return { error: { status: response.status, message: errorText } };
  } else {
    try {
      return (await response.json()) as T;
    } catch (error) {
      return { error: { message: String(error) } };
    }
  }
};

const doRefresh = async (
  client: string,
  currentRefreshToken: string,
): Promise<RefreshResponse | ApiError> => {
  return await fetchJson<RefreshResponse>(
    `${apiBaseUrl}/auth/${client}/refresh`,
    {
      accessToken: currentRefreshToken,
      method: "POST",
    },
  );
};

const fetchApiJson = async <T extends object>(
  relativeUrl: string,
  { accessToken, body, method, refreshToken }: FetchOptions = {},
): Promise<T | ApiError> => {
  const loginTokens = store.get(loginTokensAtom);
  const otpTokens = store.get(otpTokensAtom);

  if (accessToken === undefined)
    accessToken = loginTokens.accessToken || otpTokens.accessToken;
  if (refreshToken === undefined)
    refreshToken = loginTokens.refreshToken || otpTokens.refreshToken;

  const response = await (<T>fetchJson(`${apiBaseUrl}${relativeUrl}`, {
    accessToken,
    body,
    method,
  }));

  // If the response is an HTTP 401 forbidden and we have a refresh token,
  // try to get a new access token.
  if (
    refreshToken &&
    "error" in response &&
    typeof response.error === "object" &&
    response.error !== null &&
    "status" in response.error &&
    response.error.status === 401
  ) {
    const refreshResponse = await doRefresh("login", refreshToken);
    if ("accessToken" in refreshResponse) {
      store.set(loginTokensAtom, refreshResponse);
      return await fetchApiJson(relativeUrl, { body, method });
    }
  }

  return response;
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

const noTokens = { accessToken: "", refreshToken: "" };
const tokensAtom = (key: string) =>
  atomWithStorage(key, { ...noTokens }, undefined, {
    getOnInit: true,
  });
export const linkTokensAtom = tokensAtom("linkTokens");
export const loginTokensAtom = tokensAtom("loginTokens");
export const otpTokensAtom = tokensAtom("otpTokensAtom");
export const isLoggedInAtom = atom(
  (get) => get(loginTokensAtom).accessToken != "",
);
export const logoutAtom = atom(null, (_get, set) => {
  set(emailAtom, "");
  set(usernameAtom, "");
  set(linkTokensAtom, { ...noTokens });
  set(loginTokensAtom, { ...noTokens });
  set(otpTokensAtom, { ...noTokens });
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
      const response = await fetchApiJson<SuccessResponse>("/auth/send-otp", {
        accessToken: null,
        method: "POST",
        body: { email },
      });
      if ("error" in response) {
        status = {
          error:
            response.error.message ||
            "Verification code could not be sent. Please try again later.",
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
      username: null,
    };
    if (email && otp) {
      const response = await fetchApiJson<VerifyOtpResponse>(
        "/auth/verify-otp",
        {
          accessToken: null,
          method: "POST",
          body: { email, otp },
        },
      );
      if ("error" in response) {
        status = {
          error:
            response.error.message ||
            "Verification code could not be checked. Please try again later.",
          verified: false,
          username: null,
        };
      } else {
        const jwt = parseJwt(response.jwt);
        status = { error: "", verified: true, username: jwt?.uid || null };
        set(otpTokensAtom, { accessToken: response.jwt, refreshToken: "" });
      }
    }
    set(otpVerifyStatusAtom, status);
    return status;
  },
);

const accountCreateStatusAtom = atom({
  error: "",
  created: false,
  username: "",
});

export const createAccountAtom = atom(
  (get) => get(accountCreateStatusAtom),
  async (_get, set, payload: any) => {
    const resp = await fetchApiJson("/account", {
      method: "POST",
      body: payload,
    });

    if ((resp as any)?.error) {
      const status = {
        error:
          typeof (resp as any).error === "number"
            ? "Account could not be created. Please try again later."
            : (resp as any).error?.message || "Account could not be created.",
        created: false,
        username: "",
      };
      set(accountCreateStatusAtom, status);
      return status;
    }

    const username = (resp as any).access_id || "";
    const status = {
      error: "",
      created: true,
      username,
    };

    set(accountCreateStatusAtom, status);
    if (username) set(usernameAtom, username); // Populate usernameAtom here (centralized)
    return status;
  },
);

export const accountAtom = atomWithRefresh(async (get) => {
  return await fetchApiJson(`/account/${get(usernameAtom)}`);
});

export const updateAccountAtom = atom(
  (get) => get(accountUpdateStatusAtom),
  async (get, set, account) => {
    const response = await fetchApiJson<SuccessResponse>(
      `/account/${get(usernameAtom)}`,
      {
        method: "POST",
        body: account,
      },
    );

    const status =
      "error" in response
        ? {
            error: response.error.message,
            saved: false,
          }
        : { error: "", saved: true };
    set(accountUpdateStatusAtom, status);
    return status;
  },
);

// Read-only Atoms for fetching data from the API
export const countriesAtom = atom(async () => {
  const response = await fetchApiJson<CountriesResponse>("/country");
  return "error" in response ? [] : response.countries;
});

export const degreesAtom = atom(async () => {
  const response = await fetchApiJson<DegreesResponse>("/degree");
  return "error" in response ? [] : response.degrees;
});

export const academicStatusesAtom = atom(async () => {
  const response =
    await fetchApiJson<AcademicStatusesResponse>("/academic-status");
  return "error" in response ? [] : response.academicStatuses;
});

export const termsAndConditionsAtom = atom(async () => {
  const response = await fetchApiJson<TermsAndConditionsResponse>(
    "/terms-and-conditions",
  );
  return "error" in response ? null : response;
});

export const sshKeysAtom = atomWithRefresh(async (get) => {
  const response = await fetchApiJson<SshKeyResponse>(
    `/account/${get(usernameAtom)}/ssh-key`,
    {
      method: "GET",
      body: null,
    },
  );
  return "error" in response ? [] : response.sshKeys;
});

export const sshKeysDeleteAtom = atom(null, async (get, set, keyId: number) => {
  const username = get(usernameAtom);
  const response = await fetchApiJson<SuccessResponse>(
    `/account/${username}/ssh-key/${keyId}`,
    {
      method: "DELETE",
    },
  );

  // Refresh SSH Key list after deletion
  set(sshKeysAtom);

  return response;
});

export const sskKeysAddAtom = atom(
  null,
  async (get, set, publicKey: string) => {
    const username = get(usernameAtom);

    const trimmed = publicKey.trim();
    if (!trimmed) return { error: true };

    const response = await fetchApiJson<SshKeyResponse>(
      `/account/${username}/ssh-key`,
      {
        method: "POST",
        body: { public_key: trimmed },
      },
    );

    // Refresh SSH Key list after addition
    set(sshKeysAtom);

    return response;
  },
);

// Retrieving Domain information based on email address

// --------- Helper functions for Domain Atom ---------
// Pulls domain from email address
const getDomainFromEmail = (email: string) => {
  if (!email) return null;
  const email_parts = email.trim().toLowerCase().split("@");
  if (email_parts.length !== 2 || !email_parts[1]) return null;
  return email_parts[1];
};

export const domainAtom = atom(async (get) => {
  const email = get(emailAtom);
  const domain = getDomainFromEmail(email);
  if (!domain) return null;

  const response = await fetchApiJson<DomainResponse>(`/domain/${domain}`);
  // Handle backend errors
  if ("error" in response) {
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
  const filteredOrgs = rawOrgs.filter(
    (o) => o.isActive && o.isEligible === true,
  );

  // Domain is considered eligible if...
  const isEligible = rawOrgs.length === 0 || filteredOrgs.length > 0;

  return {
    domain: data.domain,
    organizations: filteredOrgs || [],
    idps: data.idps || [],
    isEligible,
  };
});

// Atom surives page refresh within the same tab
export const registrationDataAtom = atomWithStorage<RegistrationData | null>(
  "access.registrationData",
  null,
  undefined,
  { getOnInit: true },
);
