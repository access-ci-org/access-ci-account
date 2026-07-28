import { describe, it, expect } from "vitest";
import {
  strongPasswordSchema,
  passwordSchema,
  noPasswordSchema,
  profileFormSchema,
  usernameSchema,
  sshKeyFormSchema,
  authTokenSchema,
} from "@/helpers/validation";

const STRONG = "Abcdef1!ghij";

describe("strongPasswordSchema", () => {
  it("accepts a policy-compliant password", () => {
    expect(strongPasswordSchema.safeParse(STRONG).success).toBe(true);
  });

  it("rejects a weak password and surfaces the policy messages", () => {
    const result = strongPasswordSchema.safeParse("abc");
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues.length).toBeGreaterThan(0);
  });
});

describe("passwordSchema", () => {
  it("accepts matching strong passwords", () => {
    const result = passwordSchema.safeParse({
      password: STRONG,
      confirmPassword: STRONG,
    });
    expect(result.success).toBe(true);
  });

  it("rejects a mismatch on the confirmPassword path", () => {
    const result = passwordSchema.safeParse({
      password: STRONG,
      confirmPassword: STRONG + "x",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const paths = result.error.issues.map((i) => i.path.join("."));
      expect(paths).toContain("confirmPassword");
    }
  });

  it("requires a non-empty confirmation", () => {
    const result = passwordSchema.safeParse({
      password: STRONG,
      confirmPassword: "",
    });
    expect(result.success).toBe(false);
  });
});

describe("noPasswordSchema", () => {
  it("coerces missing/invalid fields to empty strings", () => {
    const result = noPasswordSchema.safeParse({ password: 123 });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.password).toBe("");
      expect(result.data.confirmPassword).toBe("");
    }
  });
});

describe("profileFormSchema", () => {
  const validProfile = {
    firstName: "Ada",
    lastName: "Lovelace",
    email: "ada@example.edu",
    organizationId: 1,
    department: "Computer Science",
    academicStatusId: 1,
    residenceCountryId: 1,
    citizenshipCountryIds: [1],
    role: [],
    degrees: [{ degreeId: 1, degreeField: "Mathematics" }],
    timeZone: "UTC",
  };

  it("accepts a fully-populated profile", () => {
    expect(profileFormSchema.safeParse(validProfile).success).toBe(true);
  });

  it("rejects a blank required string field", () => {
    expect(
      profileFormSchema.safeParse({ ...validProfile, firstName: "" }).success,
    ).toBe(false);
  });

  it("rejects an invalid email", () => {
    expect(
      profileFormSchema.safeParse({ ...validProfile, email: "not-an-email" })
        .success,
    ).toBe(false);
  });

  it("treats 0 as 'not provided' for required numbers (min is 1)", () => {
    expect(
      profileFormSchema.safeParse({ ...validProfile, organizationId: 0 })
        .success,
    ).toBe(false);
  });

  it("requires at least one country of citizenship", () => {
    expect(
      profileFormSchema.safeParse({ ...validProfile, citizenshipCountryIds: [] })
        .success,
    ).toBe(false);
  });

  it("validates nested degree entries", () => {
    expect(
      profileFormSchema.safeParse({
        ...validProfile,
        degrees: [{ degreeId: 0, degreeField: "" }],
      }).success,
    ).toBe(false);
  });
});

describe("usernameSchema", () => {
  it("defaults a missing username to an empty string", () => {
    const result = usernameSchema.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.username).toBe("");
  });
});

describe("sshKeyFormSchema", () => {
  it("requires a non-empty key", () => {
    expect(sshKeyFormSchema.safeParse({ sshKey: "" }).success).toBe(false);
    expect(sshKeyFormSchema.safeParse({ sshKey: "ssh-rsa AAAA" }).success).toBe(
      true,
    );
  });
});

describe("authTokenSchema", () => {
  it("requires both code and state", () => {
    expect(authTokenSchema.safeParse({ code: "c", state: "s" }).success).toBe(
      true,
    );
    expect(authTokenSchema.safeParse({ code: "c" }).success).toBe(false);
  });
});
