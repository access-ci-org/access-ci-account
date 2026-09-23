import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  createMemoryHistory,
  createRootRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import { useAppForm } from "@/hooks/form";
import { renderWithProviders, makeAccount, fakeResponse } from "@/test/utils";
import { loginTokensAtom, store } from "@/helpers/state";
import FormProfile from "@/components/form-profile";
import type { AccountResponse } from "@/helpers/types";

// Identifiers served by GET /time-zone. "America/Ciudad_Juarez" is deliberately
// one that older browsers' Intl time zone lists omit — the reason the options
// moved from Intl.supportedValuesOf() to the API.
const TIME_ZONES = ["America/Ciudad_Juarez", "America/New_York", "UTC"];

/** Answer the reference-data endpoints the profile form loads on mount. */
function stubApi() {
  const fetchFn = vi.fn(async (url: string) => {
    const { pathname } = new URL(url, "http://test");
    if (pathname.endsWith("/time-zone"))
      return fakeResponse({ status: 200, json: { timeZones: TIME_ZONES } });
    if (pathname.endsWith("/country"))
      return fakeResponse({
        status: 200,
        json: { countries: [{ countryId: 1, name: "United States" }] },
      });
    if (pathname.endsWith("/degree"))
      return fakeResponse({
        status: 200,
        json: { degrees: [{ degreeId: 1, name: "Bachelor's" }] },
      });
    if (pathname.endsWith("/academic-status"))
      return fakeResponse({
        status: 200,
        json: { academicStatuses: [{ academicStatusId: 1, name: "Graduate" }] },
      });
    return fakeResponse({ status: 404, json: { detail: "not stubbed" } });
  });
  vi.stubGlobal("fetch", fetchFn);
  return fetchFn;
}

function renderProfileForm({
  account,
  onSubmit,
}: {
  account: AccountResponse;
  onSubmit: (value: unknown) => void;
}) {
  function Harness() {
    const form = useAppForm({
      defaultValues: account,
      onSubmit: async ({ value }) => onSubmit(value),
    });
    return <FormProfile form={form} domain={null} account={account} />;
  }

  // FieldEmailTokens (rendered inside the form) calls useNavigate().
  const rootRoute = createRootRoute({ component: Harness });
  const router = createRouter({
    routeTree: rootRoute,
    history: createMemoryHistory({ initialEntries: ["/"] }),
  });
  return renderWithProviders(<RouterProvider router={router} />);
}

const timeZoneInput = () => document.getElementById("timeZone") as HTMLElement;

describe("FormProfile — time zone field", () => {
  beforeEach(() => {
    // fetchApiJson reads its token from state.ts's singleton store.
    store.set(loginTokensAtom, { accessToken: "t", refreshToken: "" });
    vi.stubGlobal("scrollTo", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("loads its options from the API rather than Intl", async () => {
    const intlSpy = vi.spyOn(Intl, "supportedValuesOf");
    const fetchFn = stubApi();
    renderProfileForm({ account: makeAccount(), onSubmit: vi.fn() });

    // The account's saved zone survives the options load: FieldSelect prunes
    // values missing from its options, so a mismatched list would blank it.
    expect(await screen.findByText("America/New_York")).toBeInTheDocument();
    expect(
      fetchFn.mock.calls.some(([url]) => String(url).endsWith("/time-zone")),
    ).toBe(true);
    expect(intlSpy).not.toHaveBeenCalled();
  });

  it("submits a zone chosen from the API's list", async () => {
    const user = userEvent.setup();
    stubApi();
    const onSubmit = vi.fn();
    renderProfileForm({ account: makeAccount(), onSubmit });

    await screen.findByText("America/New_York");
    await user.click(timeZoneInput());
    await user.click(await screen.findByText("America/Ciudad_Juarez"));

    await user.click(screen.getByRole("button", { name: /Save Profile/ }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit.mock.calls[0][0]).toMatchObject({
      timeZone: "America/Ciudad_Juarez",
    });
  });
});
