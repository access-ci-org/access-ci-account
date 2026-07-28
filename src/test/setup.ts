// Global Vitest setup, loaded via `test.setupFiles` in vite.config.ts.
//
// Note on import-time side effects: `src/config.tsx` reads
// `window.location.host` at import, and `src/helpers/state.ts` seeds
// localStorage from VITE_INIT_* at module load. jsdom's default location
// (http://localhost/) and the empty VITE_INIT_* values make those imports
// safe, so we only need to keep per-test state from leaking and to polyfill
// the browser APIs jsdom does not provide.

import "@testing-library/jest-dom/vitest";
import { webcrypto } from "node:crypto";
import { afterEach, beforeEach } from "vitest";
import { cleanup } from "@testing-library/react";

// jsdom may not expose the Web Crypto API that state.ts uses for OIDC `state`
// generation and notification IDs. Back it with Node's implementation.
if (!globalThis.crypto?.getRandomValues) {
  Object.defineProperty(globalThis, "crypto", {
    value: webcrypto,
    configurable: true,
  });
}

// jsdom has no ResizeObserver; the input-otp library (FieldOtp) needs it.
if (!globalThis.ResizeObserver) {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

// jsdom does not implement elementFromPoint; input-otp's password-manager
// badge detection calls it from a timer and would throw after the test ends.
if (!document.elementFromPoint) {
  document.elementFromPoint = () => null;
}

// Unmount React trees and reset persisted state between tests.
afterEach(() => {
  cleanup();
  localStorage.clear();
  sessionStorage.clear();
});

// Start every test from a clean storage slate as well, in case a module-load
// side effect wrote to localStorage before the first `afterEach` ran.
beforeEach(() => {
  localStorage.clear();
});
