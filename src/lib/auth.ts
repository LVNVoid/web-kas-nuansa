import { cookies } from "next/headers";

const JWT_SECRET =
  process.env.NEXTAUTH_SECRET || "default-secret-key-change-in-production-12345678";

export const AUTH_COOKIE_NAME = "kas_admin_session";

function bufferToBase64Url(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlToBuffer(base64url: string): Uint8Array {
  const base64 = base64url.replace(/-/g, "+").replace(/_/g, "/");
  const pad = base64.length % 4;
  const padded = pad ? base64 + "=".repeat(4 - pad) : base64;
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export function hashPassword(password: string): string {
  // Deterministic fast hash for passwords
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    hash = (hash << 5) - hash + password.charCodeAt(i);
    hash |= 0;
  }
  return `pwd_h_${Math.abs(hash)}_${password.length}`;
}

export interface SessionPayload {
  userId: string;
  username: string;
  name: string;
  exp?: number;
}

async function getHmacKey(): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return await crypto.subtle.importKey(
    "raw",
    enc.encode(JWT_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export async function signSessionToken(payload: SessionPayload): Promise<string> {
  const enc = new TextEncoder();
  const header = JSON.stringify({ alg: "HS256", typ: "JWT" });
  const exp = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60; // 7 days
  const fullPayload = JSON.stringify({ ...payload, exp });

  const encodedHeader = bufferToBase64Url(enc.encode(header));
  const encodedPayload = bufferToBase64Url(enc.encode(fullPayload));
  const data = `${encodedHeader}.${encodedPayload}`;

  const key = await getHmacKey();
  const signature = await crypto.subtle.sign("HMAC", key, enc.encode(data));

  return `${data}.${bufferToBase64Url(signature)}`;
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const [encodedHeader, encodedPayload, signature] = parts;

    const data = `${encodedHeader}.${encodedPayload}`;
    const enc = new TextEncoder();
    const key = await getHmacKey();

    const signatureBuffer = base64UrlToBuffer(signature);
    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      signatureBuffer as unknown as ArrayBuffer,
      enc.encode(data)
    );

    if (!isValid) return null;

    const payloadJson = new TextDecoder().decode(base64UrlToBuffer(encodedPayload));
    const payload = JSON.parse(payloadJson);

    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return {
      userId: payload.userId,
      username: payload.username,
      name: payload.name,
    };
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return null;
  return await verifySessionToken(token);
}
