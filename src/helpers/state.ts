import {
  apiBaseUrl,
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
  const headers = new Headers({
    accept: "application/json",
    "content-type": "application/json",
  });
  const token = store.get(tokenAtom);
  if (token) headers.append("Authorization", `Bearer ${token}`);

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
        status = { error: "", verified: true };
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
