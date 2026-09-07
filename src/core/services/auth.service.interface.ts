import { SessionPayload } from "../entities/user.entity";

export interface IAuthService {
  hashPassword(password: string): string;
  signSessionToken(payload: SessionPayload): Promise<string>;
  verifySessionToken(token: string): Promise<SessionPayload | null>;
  getSession(): Promise<SessionPayload | null>;
  setSessionCookie(token: string): Promise<void>;
  deleteSessionCookie(): Promise<void>;
}
