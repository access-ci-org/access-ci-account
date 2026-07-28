// Sanity tests for the shared test infrastructure itself, so the wiring in
// setup.ts / utils.tsx is guaranteed working before real suites depend on it.
import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { atom, useAtomValue } from "jotai";
import {
  renderWithProviders,
  createTestStore,
  makeJwt,
  makeAccount,
  makeDomainResponse,
} from "@/test/utils";
import { parseJwt } from "@/helpers/jwt";

const messageAtom = atom("");

function Message() {
  return <p>{useAtomValue(messageAtom)}</p>;
}

describe("test infrastructure", () => {
  it("renders into jsdom and reads from the provided Jotai store", () => {
    const store = createTestStore();
    store.set(messageAtom, "hello from the store");
    renderWithProviders(<Message />, { store });
    expect(screen.getByText("hello from the store")).toBeInTheDocument();
  });

  it("gives each render an isolated store", () => {
    const { store } = renderWithProviders(<Message />);
    expect(store.get(messageAtom)).toBe("");
  });

  it("makeJwt produces a token parseJwt can decode", () => {
    const token = makeJwt({ sub: "ada@access-ci.org", isAdmin: true });
    const decoded = parseJwt(token);
    expect(decoded.sub).toBe("ada@access-ci.org");
    expect(decoded.isAdmin).toBe(true);
  });

  it("factories apply overrides", () => {
    expect(makeAccount({ username: "grace" }).username).toBe("grace");
    expect(makeDomainResponse({ domain: "psc.edu" }).domain).toBe("psc.edu");
  });
});
