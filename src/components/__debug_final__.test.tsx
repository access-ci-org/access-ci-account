// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";

(global as any).ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import { useAppForm } from "@/hooks/form";
import FormProfile from "@/components/form-profile";
import {
  store,
  domainAtom,
  emailAtom,
  usernameAtom,
  loginTokensAtom,
  profileFormAtom,
  saveProfileAtom,
} from "@/helpers/state";
import { profileFormSchemaWithRecoveries, usernameSchema } from "@/helpers/validation";

const navigateSpy = vi.fn();
vi.mock("@tanstack/react-router", async (importOriginal) => {
  const actual = await importOriginal<any>();
  return { ...actual, useNavigate: () => navigateSpy };
});

const validAccount = {
  username: "user1",
  firstName: "Test",
  lastName: "User",
  email: "primary@psc.edu",
  recoveryEmails: [{ email: "eligible@psc.edu", verified: true }, { email: "old@blocked.com", verified: true }],
  organizationId: 1,
  academicStatusId: 1,
  residenceCountryId: 1,
  citizenshipCountryIds: [1],
  department: "CS",
  degrees: [],
  timeZone: "UTC",
  role: [],
};

const incompleteAccount = { ...validAccount, organizationId: 0 };

global.fetch = vi.fn(async (url: any) => {
  const u = String(url);
  if (u.includes("/domain/psc.edu")) {
    return {
      status: 200,
      json: async () => ({
        domain: "psc.edu",
        organizations: [{ organizationId: 1, organizationName: "PSC", isActive: true, isEligible: true }],
        idps: [],
      }),
    } as any;
  }
  if (u.includes("/domain/blocked.com")) {
    return { status: 400, json: async () => ({ detail: "Ineligible domain" }), text: async () => "Ineligible domain" } as any;
  }
  if (u.includes("/academic-status")) {
    return { status: 200, json: async () => ({ academicStatuses: [{ academicStatusId: 1, name: "Grad" }] }) } as any;
  }
  if (u.includes("/country")) {
    return { status: 200, json: async () => ({ countries: [{ countryId: 1, name: "USA" }] }) } as any;
  }
  return { status: 200, json: async () => ({ success: true }) } as any;
}) as any;

function Harness({ domain, account }: { domain: any; account: any }) {
  const form = useAppForm({
    defaultValues: account,
    validators: { onSubmit: profileFormSchemaWithRecoveries.and(usernameSchema) },
    onSubmit: async ({ value }) => {
      store.set(profileFormAtom, value);
      await store.set(saveProfileAtom);
    },
  });
  return <FormProfile form={form} domain={domain} />;
}

beforeEach(() => {
  cleanup();
  localStorage.clear();
  store.set(usernameAtom, "user1");
  store.set(emailAtom, "primary@psc.edu");
  store.set(loginTokensAtom, { accessToken: "fake", refreshToken: "fake" });
  navigateSpy.mockClear();
  Object.defineProperty(window, "scrollTo", { value: vi.fn(), writable: true });
});

describe("final verification", () => {
  it("no atomFamily deprecation warning", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const domain = await store.get(domainAtom);
    render(
      <JotaiProvider store={store}>
        <Harness domain={domain} account={validAccount} />
      </JotaiProvider>,
    );
    await new Promise((r) => setTimeout(r, 100));
    const deprecationCalls = warnSpy.mock.calls.filter((c) => String(c[0]).includes("DEPRECATED"));
    console.log("deprecation warnings", deprecationCalls);
    expect(deprecationCalls.length).toBe(0);
    warnSpy.mockRestore();
  });

  it("valid, unchanged account: Save Profile submits", async () => {
    const domain = await store.get(domainAtom);
    render(
      <JotaiProvider store={store}>
        <Harness domain={domain} account={validAccount} />
      </JotaiProvider>,
    );
    fireEvent.click(screen.getByRole("button", { name: /Save Profile/i }));
    await new Promise((r) => setTimeout(r, 300));
    const calls = (global.fetch as any).mock.calls.map((c: any) => c[0]);
    console.log("fetch calls", calls);
    expect(calls.some((c: string) => c.includes("/account/user1"))).toBe(true);
  });

  it("incomplete account: Save Profile scrolls to top so errors are visible", async () => {
    const domain = await store.get(domainAtom);
    render(
      <JotaiProvider store={store}>
        <Harness domain={domain} account={incompleteAccount} />
      </JotaiProvider>,
    );
    fireEvent.click(screen.getByRole("button", { name: /Save Profile/i }));
    await new Promise((r) => setTimeout(r, 300));
    console.log("scrollTo calls", (window.scrollTo as any).mock.calls);
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0 });
    const errorEls = document.querySelectorAll('[data-slot="field-error"]');
    console.log("errors shown:", Array.from(errorEls).map((e) => e.textContent));
    expect(errorEls.length).toBeGreaterThan(0);
  });

  it("Make Primary only shown for eligible domain recovery token", async () => {
    const domain = await store.get(domainAtom);
    render(
      <JotaiProvider store={store}>
        <Harness domain={domain} account={validAccount} />
      </JotaiProvider>,
    );
    await new Promise((r) => setTimeout(r, 150));

    const triggers = screen.getAllByRole("button", { name: /Options for/i });
    expect(triggers.length).toBe(3); // primary token + one per recovery token

    let makePrimaryCount = 0;
    for (const trigger of triggers) {
      fireEvent.pointerDown(trigger, { button: 0, pointerId: 1 });
      fireEvent.pointerUp(trigger, { button: 0, pointerId: 1 });
      makePrimaryCount += screen.queryAllByText("Make Primary").length;
      fireEvent.keyDown(document, { key: "Escape" });
    }
    console.log("make primary item count", makePrimaryCount);
    expect(makePrimaryCount).toBe(1);
  });
});
