// Shared test helpers: provider-aware rendering, a TanStack Form field harness,
// and factories for fake API responses. Imported by unit and component tests.

import { render, type RenderOptions } from "@testing-library/react";
import type { ReactElement, ReactNode } from "react";
import { Provider, createStore } from "jotai";
import { useAppForm } from "@/hooks/form";
import type {
  AcademicStatusesResponse,
  AccountResponse,
  ApiError,
  CountriesResponse,
  DegreesResponse,
  DomainResponse,
  Organization,
} from "@/helpers/types";

export type TestStore = ReturnType<typeof createStore>;

/** A fresh, isolated Jotai store so atom state never leaks between tests. */
export function createTestStore(): TestStore {
  return createStore();
}

/**
 * Render `ui` inside a Jotai Provider. Returns the created `store` so tests can
 * seed or assert atom state via `store.set` / `store.get`.
 */
export function renderWithProviders(
  ui: ReactElement,
  {
    store = createTestStore(),
    ...options
  }: { store?: TestStore } & Omit<RenderOptions, "wrapper"> = {},
) {
  function Wrapper({ children }: { children: ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
  }
  return { store, ...render(ui, { wrapper: Wrapper, ...options }) };
}

/**
 * Mount a single `Field*` component inside a real TanStack Form context, the
 * same way the app's forms do. The `render` callback receives the augmented
 * field API (e.g. `field.FieldSelect`, `field.FieldText`).
 */
export function renderField<Values extends Record<string, unknown>>({
  name,
  defaultValues,
  render: renderFn,
  store,
}: {
  name: keyof Values & string;
  defaultValues: Values;
  render: (field: any) => ReactNode;
  store?: TestStore;
}) {
  function Harness() {
    const form = useAppForm({ defaultValues });
    return (
      <form.AppField name={name as never}>
        {(field: any) => renderFn(field)}
      </form.AppField>
    );
  }
  return renderWithProviders(<Harness />, { store });
}

// --- JWT ------------------------------------------------------------------

function base64UrlEncode(input: string): string {
  const b64 = btoa(
    encodeURIComponent(input).replace(/%([0-9A-Fa-f]{2})/g, (_, hex) =>
      String.fromCharCode(parseInt(hex, 16)),
    ),
  );
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/** Build a JWT string that `parseJwt` (src/helpers/jwt.ts) can decode. */
export function makeJwt(payload: Record<string, unknown>): string {
  const header = base64UrlEncode(JSON.stringify({ alg: "none", typ: "JWT" }));
  const body = base64UrlEncode(JSON.stringify(payload));
  return `${header}.${body}.`;
}

// --- fetch mocking --------------------------------------------------------

/**
 * Build a minimal object shaped like the parts of `Response` that
 * `fetchJson` (src/helpers/state.ts) consumes: `.status`, `.json()`, `.text()`.
 * When `json` is omitted, `.json()` rejects so callers exercise the
 * text()/catch fallback paths.
 */
export function fakeResponse({
  status = 200,
  json,
  text = "",
}: {
  status?: number;
  json?: unknown;
  text?: string;
}): Response {
  return {
    status,
    json: async () => {
      if (json === undefined) throw new Error("no json body");
      return json;
    },
    text: async () => text,
  } as unknown as Response;
}

// --- API response factories ----------------------------------------------

export function makeApiError(
  message = "Something went wrong",
  status?: number,
): ApiError {
  return { error: { message, ...(status !== undefined ? { status } : {}) } };
}

export function makeCountriesResponse(
  countries: { countryId: number; name: string }[] = [
    { countryId: 1, name: "United States" },
    { countryId: 2, name: "Canada" },
  ],
): CountriesResponse {
  return { countries };
}

export function makeDegreesResponse(
  degrees: { degreeId: number; name: string }[] = [
    { degreeId: 1, name: "Bachelor's" },
    { degreeId: 2, name: "Master's" },
  ],
): DegreesResponse {
  return { degrees };
}

export function makeAcademicStatusesResponse(
  academicStatuses: { academicStatusId: number; name: string }[] = [
    { academicStatusId: 1, name: "Undergraduate" },
    { academicStatusId: 2, name: "Graduate" },
  ],
): AcademicStatusesResponse {
  return { academicStatuses };
}

export function makeOrganization(
  overrides: Partial<Organization> = {},
): Organization {
  return {
    organizationId: 1,
    orgTypeId: 1,
    organizationAbbrev: "EX",
    organizationName: "Example University",
    organizationUrl: null,
    organizationPhone: null,
    nsfOrgCode: null,
    isReconciled: true,
    amieName: null,
    countryId: 1,
    stateId: null,
    latitude: null,
    longitude: null,
    isMsi: null,
    isActive: true,
    isEligible: true,
    carnegieCategories: [],
    state: null,
    country: null,
    orgType: null,
    ignoreIdp: null,
    ...overrides,
  };
}

export function makeDomainResponse(
  overrides: Partial<DomainResponse> = {},
): DomainResponse {
  return {
    domain: "example.edu",
    organizations: [makeOrganization()],
    idps: [],
    ...overrides,
  };
}

export function makeAccount(
  overrides: Partial<AccountResponse> = {},
): AccountResponse {
  return {
    firstName: "Ada",
    lastName: "Lovelace",
    email: "ada@example.edu",
    organizationId: 1,
    academicStatusId: 1,
    residenceCountryId: 1,
    citizenshipCountryIds: [1],
    department: "Computer Science",
    degrees: [{ degreeId: 1, degreeField: "Mathematics" }],
    timeZone: "America/New_York",
    role: [],
    username: "alovelace",
    ...overrides,
  };
}
