import {
  apiBaseUrl,
  initEmail,
  initToken,
  initUsername,
  ssoCookieDomain,
  ssoCookieName,
  ssoCookiePath,
} from "@/config";
import { atom, createStore, type WritableAtom } from "jotai";
import {
  atomWithRefresh,
  atomWithReset,
  atomWithStorage,
  createJSONStorage,
  RESET,
} from "jotai/utils";
import { parseJwt } from "./jwt";
import {
  type AcademicStatusesResponse,
  type AccountResponse,
  type ApiError,
  type AppNotification,
  type CountriesResponse,
  type CreateAccountResponse,
  type CreateAccountStatus,
  type DegreesResponse,
  type DomainResponse,
  type FetchOptions,
  type IdentityResponse,
  type OidcClientType,
  type OidcInfoResponse,
  type OidcTokensResponse,
  type Option,
  type RefreshResponse,
  type RegistrationFields,
  type SshKeyResponse,
  type SuccessResponse,
  type TermsAndConditionsResponse,
  type VerifyOtpResponse,
} from "./types";
import { profileDefaultValues, registrationDefaultValues } from "./defaults";
import { getDomainFromEmail } from "./email";

export const store = createStore();

// Like atomWithStorage, but reads the value from localStorage once on init
// without subscribing to the `storage` event, so atoms don't sync across tabs.
function atomWithLocalStorage<Value>(
  key: string,
  initialValue: Value,
  options?: { getOnInit?: boolean },
) {
  const { subscribe, ...storage } = createJSONStorage<Value>();
  return atomWithStorage(key, initialValue, storage, {
    getOnInit: true,
    ...options,
  });
}

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

const doRefresh = async (client: OidcClientType): Promise<boolean> => {
  const clientTokensAtom: WritableAtom<
    { accessToken: string; refreshToken: string },
    [RefreshResponse],
    unknown
  > = client === "link" ? linkTokensAtom : loginTokensAtom;

  const refreshResponse = await store.set(
    oidcTokensAtom,
    client,
    null,
    store.get(clientTokensAtom).refreshToken,
  );

  const success = "accessToken" in refreshResponse;
  if (success) {
    const { accessToken, refreshToken } = refreshResponse;
    store.set(clientTokensAtom, { accessToken, refreshToken });
  } else {
    store.set(clientTokensAtom, { ...noTokens });
  }
  return success;
};

const isTokenUnexpired = (token: string) => {
  if (!token) return false;

  const jwt = parseJwt(token);
  if (!jwt?.exp) return false;

  return jwt.exp * 1000 > Date.now();
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
    if (await doRefresh("login"))
      return await fetchApiJson(relativeUrl, { body, method });
  }

  return response;
};

if (initEmail) localStorage.setItem("email", JSON.stringify(initEmail));
if (initUsername)
  localStorage.setItem("username", JSON.stringify(initUsername));
if (initToken) localStorage.setItem("token", JSON.stringify(initToken));

export const showWelcomeMessageAtom = atomWithLocalStorage(
  "showWelcomeMessage",
  false,
);
export const emailAtom = atomWithLocalStorage("email", "");
export const usernameAtom = atomWithLocalStorage("username", "");
// If the user is an admin, adminUsernameAtom contains their real username,
// while usernameAtom contains the username of the user they are acting as.
export const adminUsernameAtom = atomWithLocalStorage("adminUsername", "");

export const isAdminAtom = atom((get) => get(adminUsernameAtom) !== "");
export const isImpersonatingAtom = atom(
  (get) => get(isAdminAtom) && get(adminUsernameAtom) !== get(usernameAtom),
);
export const impersonateAtom = atom(
  null,
  async (get, set, username: string) => {
    if (get(isAdminAtom)) {
      set(usernameAtom, username);
      set(accountAtom);
      return await get(accountAtom);
    }
  },
);
export const stopImpersonatingAtom = atom(
  null,
  async (get, set) => await set(impersonateAtom, get(adminUsernameAtom)),
);

export const oidcInfoAtom = atom(async () =>
  fetchApiJson<OidcInfoResponse>("/auth/info", {
    accessToken: null,
  }),
);

export const oidcStateAtom = atomWithLocalStorage("oidcState", "");
const generateOidcStateValue = () => {
  const array = new Uint8Array(128);
  window.crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(36).charAt(0))
    .join("")
    .substring(0, 128);
};

const getRedirectUri = (client: OidcClientType) =>
  `${window.location.protocol}//${window.location.host}${import.meta.env.BASE_URL.replace(/\/$/, "")}/auth-token/${client}`;

export const oidcAuthorizeAtom = atom(
  null,
  async (get, set, client: OidcClientType = "login", idphint: string = "") => {
    const oidcInfo = await get(oidcInfoAtom);
    if ("error" in oidcInfo) return oidcInfo;

    // Refresh the OIDC state value.
    set(oidcStateAtom, generateOidcStateValue());

    const params = new URLSearchParams({
      client_id: oidcInfo.clientIds[client],
      redirect_uri: getRedirectUri(client),
      response_type: "code",
      scope: "openid profile email org.cilogon.userinfo",
      skin: "access",
      state: get(oidcStateAtom),
    });

    if (idphint) params.set("idphint", idphint);
    if (client === "link") params.set("prompt", "consent");

    window.location.href = `${oidcInfo.authorizationUrl}?${params.toString()}`;
  },
);

export const oidcTokensAtom = atom(
  null,
  async (
    get,
    _set,
    client: OidcClientType = "login",
    code: string | null = null,
    refreshToken: string | null = null,
  ) => {
    const oidcInfo = await get(oidcInfoAtom);
    if ("error" in oidcInfo) return oidcInfo;

    const body = {
      clientId: oidcInfo.clientIds[client],
      code,
      grantType: refreshToken ? "refresh_token" : "authorization_code",
      redirectUri: getRedirectUri(client),
      refreshToken,
    };

    return await fetchApiJson<OidcTokensResponse>("/auth/oauth2/token", {
      accessToken: null,
      body,
      method: "POST",
      refreshToken: null,
    });
  },
);

const noTokens = { accessToken: "", refreshToken: "" };
const tokensAtom = (key: string) => atomWithLocalStorage(key, { ...noTokens });
export const linkTokensAtom = tokensAtom("linkTokens");
export const loginTokensAtom = tokensAtom("loginTokens");
export const otpTokensAtom = tokensAtom("otpTokensAtom");
export const isLoggedInAtom = atom(
  (get) => get(loginTokensAtom).accessToken != "",
);
export const logoutAtom = atom(null, (_get, set) => {
  set(emailAtom, "");
  set(usernameAtom, "");
  set(adminUsernameAtom, "");
  set(linkTokensAtom, { ...noTokens });
  set(loginTokensAtom, { ...noTokens });
  set(otpTokensAtom, { ...noTokens });
  document.cookie = `${ssoCookieName}=; Max-Age=0; Path=${ssoCookiePath}; Domain=${ssoCookieDomain};`;
});

export const otpAtom = atom("");
const otpSendStatusAtom = atom({ error: "", sent: false });
const otpVerifyStatusAtom = atom({ error: "", verified: false });
const accountUpdateStatusAtom = atom({ error: "", saved: false });

export const registrationFormAtom = atomWithReset<RegistrationFields>(
  registrationDefaultValues,
);

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
            response.error.status === 429
              ? "You have exceeded the limit for sending verification codes. Please try again in an hour."
              : response.error.message ||
                "Verification code could not be sent. Please try again later.",
          sent: false,
        };
      } else {
        status = { error: "", sent: true };
      }
    }
    if (status.error)
      set(pushNotificationAtom, {
        title: "Error Sending Verification Code",
        message: status.error,
        variant: "error",
      });
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

export const accountCreateStatusAtom = atom<CreateAccountStatus>({
  error: "",
  created: false,
  username: "",
  idp: "",
});

export const createAccountAtom = atom(
  (get) => get(accountCreateStatusAtom),
  async (get, set) => {
    const exitWithStatus = (status: CreateAccountStatus) => {
      // Update the status.
      set(accountCreateStatusAtom, status);
      // Show the welcome message if the account was created.
      set(showWelcomeMessageAtom, status.created);
      // Reset all inputs and tokens.
      set(registrationFormAtom, RESET);
      set(registrationPasswordAtom, "");
      set(logoutAtom);
      return status;
    };

    const linkTokens = get(linkTokensAtom);
    if (linkTokens.refreshToken)
      if (!(await doRefresh("link")))
        return exitWithStatus({
          error: "Access token is invalid or has expired.",
          created: false,
          username: "",
          idp: "",
        });

    const creationResponse = await fetchApiJson<CreateAccountResponse>(
      "/account",
      {
        method: "POST",
        body: {
          ...get(registrationFormAtom),
          cilogonToken: get(linkTokensAtom).accessToken,
        },
      },
    );

    if ("error" in creationResponse)
      return exitWithStatus({
        error: creationResponse.error.message,
        created: false,
        username: "",
        idp: "",
      });

    const password = get(registrationPasswordAtom);
    if (password) await set(updatePasswordAtom, password, false);

    const domain = await get(domainAtom);
    const idp =
      domain?.idps && domain.idps.length > 0
        ? domain.idps[0].displayName
        : "ACCESS CI (XSEDE)";

    return exitWithStatus({
      error: "",
      created: true,
      username: creationResponse.access_id,
      idp,
    });
  },
);

export const accountAtom = atomWithRefresh(async (get) => {
  return await fetchApiJson<AccountResponse>(`/account/${get(usernameAtom)}`);
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

export const countryOptionsAtom = atom<Promise<Option<number>[]>>(async (get) =>
  (await get(countriesAtom)).map((country) => ({
    value: country.countryId,
    label: country.name,
  })),
);

export const degreesAtom = atom(async () => {
  const response = await fetchApiJson<DegreesResponse>("/degree");
  return "error" in response ? [] : response.degrees;
});

export const degreeOptionsAtom = atom<Promise<Option<number>[]>>(async (get) =>
  (await get(degreesAtom)).map((degree) => ({
    value: degree.degreeId,
    label: degree.name,
  })),
);

export const academicStatusesAtom = atom(async () => {
  const response =
    await fetchApiJson<AcademicStatusesResponse>("/academic-status");
  return "error" in response ? [] : response.academicStatuses;
});

export const academicStatusOptionsAtom = atom<Promise<Option<number>[]>>(
  async (get) =>
    (await get(academicStatusesAtom)).map((status) => ({
      value: status.academicStatusId,
      label: status.name,
    })),
);

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
  return "error" in response ? response : response.sshKeys;
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
  await get(sshKeysAtom);

  return response;
});

export const sskKeysAddAtom = atom(
  null,
  async (get, set, publicKey: string) => {
    const username = get(usernameAtom);

    const trimmed = publicKey.trim();
    if (!trimmed) return { error: { message: "SSH public key is required." } };

    const response = await fetchApiJson<SshKeyResponse>(
      `/account/${username}/ssh-key`,
      {
        method: "POST",
        body: { public_key: trimmed },
      },
    );

    // Refresh SSH Key list after addition
    set(sshKeysAtom);
    await get(sshKeysAtom);

    return response;
  },
);

export const identityAtom = atomWithRefresh(async (get) => {
  const response = await fetchApiJson<IdentityResponse>(
    `/account/${get(usernameAtom)}/identity`,
    {
      method: "GET",
      body: null,
    },
  );
  return "error" in response ? response : response.identities;
});

export const identityAddAtom = atom(null, async (get, set) => {
  const linkTokens = get(linkTokensAtom);
  // Ensure access token is valid before adding identity and attempt refresh if possible.
  if (linkTokens.refreshToken) {
    if (!(await doRefresh("link"))) {
      const status = {
        error: "Access token is invalid or has expired.",
        added: false,
      };
      return status;
    }
  }

  // POST identity using CiLogin flow from linkTokenAtom
  const response = await fetchApiJson<IdentityResponse>(
    `/account/${get(usernameAtom)}/identity`,
    {
      method: "POST",
      body: { cilogonToken: get(linkTokensAtom).accessToken },
    },
  );

  // Clear link tokens after the API request
  set(linkTokensAtom, { ...noTokens });

  // Profile Save Errors
  if ("error" in response) {
    const status = {
      added: false,
      error: response.error.message || "Linked account could not be added.",
    };
    set(pushNotificationAtom, {
      id: "add-identity-error",
      title: "Error Adding Linked Account",
      message: status.error,
      variant: "error",
    });
    return status;
  }

  const status = { added: true, error: "" };

  set(pushNotificationAtom, {
    id: "identity-added",
    title: "Linked Account Added",
    message: "Your linked account has been added successfully.",
    variant: "success",
  });

  // Refresh identities list after addition
  set(identityAtom);
  await get(identityAtom);
  return status;
});

export const identityDeleteAtom = atom(
  null,
  async (get, set, identityId: number) => {
    const username = get(usernameAtom);
    const response = await fetchApiJson<SuccessResponse>(
      `/account/${username}/identity/${identityId}`,
      {
        method: "DELETE",
      },
    );

    // Refresh identities list after deletion
    set(identityAtom);
    await get(identityAtom);

    return response;
  },
);

// Retrieving Domain information based on email address
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

export const organizationIdOptionsAtom = atom<Promise<Option<number>[]>>(
  async (get) =>
    (await get(domainAtom))?.organizations?.map((org) => ({
      value: org.organizationId,
      label:
        org.organizationName ??
        org.organizationAbbrev ??
        `Organization ${org.organizationId}`,
    })) ?? [],
);

export const hasIdpsAtom = atom<Promise<boolean>>(async (get) => {
  const domain = await get(domainAtom);
  return (domain?.idps ?? []).length > 0;
});

export const notificationsAtom = atom<AppNotification[]>([]);

// Helper: add a notification
export const pushNotificationAtom = atom(
  null,
  (get, set, n: Omit<AppNotification, "id"> & { id?: string }) => {
    const id = n.id ?? crypto.randomUUID();

    // Filter out existing notifications with the same ID.
    const current = get(notificationsAtom).filter(
      (notification) => notification.id !== id,
    );

    const next: AppNotification = {
      id,
      variant: n.variant ?? "info",
      dismissible: n.dismissible ?? true,
      ...n,
    };
    set(notificationsAtom, [...current, next]);
  },
);

// Helper: remove a notification
export const dismissNotificationAtom = atom(
  null,
  (get, set, id: string | string[]) => {
    set(
      notificationsAtom,
      get(notificationsAtom).filter((n) =>
        Array.isArray(id) ? !id.includes(n.id) : n.id !== id,
      ),
    );
  },
);

// Helper: Clear all
export const clearNotificationsAtom = atom(null, (_get, set) => {
  set(notificationsAtom, []);
});

export const profileFormAtom = atom<AccountResponse>(profileDefaultValues);

export const saveProfileAtom = atom(null, async (get, set) => {
  const profileForm = get(profileFormAtom);
  const { saved, error } = await set(updateAccountAtom, {
    ...profileForm,
    emailOtpToken: get(otpTokensAtom).accessToken,
  });
  if (saved) {
    set(pushNotificationAtom, {
      id: "profile-saved",
      title: "Profile Saved",
      message: "Changes to your profile have been saved.",
      variant: "success",
    });
    // Refresh the account and wait for it to reload.
    set(accountAtom);
    await get(accountAtom);
  } else {
    set(pushNotificationAtom, {
      id: "profile-error",
      title: "Error Saving Profile",
      message: error,
      variant: "error",
    });
  }
  return { saved, error };
});

export const hasOtpTokenAtom = atom((get) =>
  isTokenUnexpired(get(otpTokensAtom).accessToken),
);

export const registrationPasswordAtom = atom("");

export const updatePasswordAtom = atom(
  null,
  async (get, set, password: string, notifySuccess: boolean = true) => {
    const isLoggedIn = get(isLoggedInAtom);
    const hasOtpToken = get(hasOtpTokenAtom);
    const username = get(usernameAtom);

    let response: SuccessResponse | ApiError;

    if (isLoggedIn) {
      response = await fetchApiJson<SuccessResponse>(
        `/account/${username}/password`,
        {
          method: "POST",
          body: { password },
          accessToken: get(loginTokensAtom).accessToken,
        },
      );
    } else if (hasOtpToken) {
      response = await fetchApiJson<SuccessResponse>("/auth/password-reset", {
        method: "POST",
        body: { password },
        accessToken: get(otpTokensAtom).accessToken,
      });
    } else {
      set(pushNotificationAtom, {
        id: "password-update-error",
        title: "Error Updating Password",
        message:
          "You must be logged in or verify your email before changing your password.",
        variant: "error",
      });

      return false;
    }

    if ("error" in response) {
      set(pushNotificationAtom, {
        id: "password-update-error",
        title: "Error Updating Password",
        message: response.error.message.includes("previous password")
          ? "The password you entered matches a previous password. Please choose a new password and try again."
          : response.error.message || "Password could not be updated.",
        variant: "error",
      });

      return false;
    }

    if (notifySuccess)
      set(pushNotificationAtom, {
        id: "password-updated",
        title: "Password Updated",
        message: "Your password has been updated successfully.",
        variant: "success",
      });

    return true;
  },
);
