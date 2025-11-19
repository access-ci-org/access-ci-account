import { apiBaseUrl } from "@/config";
import { atom, createStore } from "jotai";

export const store = createStore();

const fetchApiJson = async (
  relativeUrl: string,
  { body = null, method = "GET" }: { body: any; method: string },
) => {
  const absoluteUrl = `${apiBaseUrl}${relativeUrl}`;
  const headers = new Headers();
  const token = store.get(tokenAtom);
  if (token) headers.append("Authorization", `Bearer ${token}`);

  const response = await fetch(absoluteUrl, {
    body: body ? JSON.stringify(body) : null,
    headers: {
      ...headers,
      accept: "application/json",
      "content-type": "application/json",
    },
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
const otpStatusAtom = atom({ error: "", sent: false });
export const tokenAtom = atom("");

export const sendOtpAtom = atom(
  (get) => get(otpStatusAtom),
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
          error: "Verification code could not be sent. Please try again later.",
          sent: false,
        };
      } else {
        status = { error: "", sent: true };
      }
    }
    set(otpStatusAtom, status);
    return status;
  },
);
