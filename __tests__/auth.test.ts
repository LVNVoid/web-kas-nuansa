import { hashPassword, signSessionToken, verifySessionToken } from "@/lib/auth";

describe("Authentication Utilities", () => {
  it("should hash passwords deterministically", () => {
    const hash1 = hashPassword("secret123");
    const hash2 = hashPassword("secret123");
    const hash3 = hashPassword("other123");

    expect(hash1).toEqual(hash2);
    expect(hash1).not.toEqual(hash3);
    expect(hash1.startsWith("pwd_h_")).toBe(true);
  });

  it("should sign and verify valid JWT session tokens", async () => {
    const payload = {
      userId: "user_123",
      username: "admin",
      name: "Bendahara RT",
    };

    const token = await signSessionToken(payload);
    expect(typeof token).toBe("string");

    const verified = await verifySessionToken(token);
    expect(verified).not.toBeNull();
    expect(verified?.userId).toBe(payload.userId);
    expect(verified?.username).toBe(payload.username);
  });

  it("should return null when verifying invalid tokens", async () => {
    const invalid = await verifySessionToken("invalid.token.string");
    expect(invalid).toBeNull();
  });
});
