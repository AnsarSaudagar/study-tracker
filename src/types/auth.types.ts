/**
 * Shared types for the authentication module.
 * These describe exactly what is persisted in LocalStorage so the storage
 * layer can be swapped for a real backend API without touching the UI.
 */

/** A registered user record as stored in LocalStorage. */
export interface StoredUser {
  id: string;
  fullName: string;
  email: string;
  /** bcrypt hash of the password. Never store plain text. */
  passwordHash: string;
  createdAt: string;
}

/** The public user shape exposed to the app (no password material). */
export interface User {
  id: string;
  fullName: string;
  email: string;
  createdAt: string;
}

/** The authenticated session persisted in LocalStorage. */
export interface Session {
  userId: string;
  /** When true the session is restored across browser restarts. */
  remember: boolean;
  createdAt: string;
}

export type Theme = 'light' | 'dark';

export interface Preferences {
  theme: Theme;
}

export interface SignupInput {
  fullName: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
  remember: boolean;
}

/** Result wrapper returned by the auth service. */
export type AuthResult =
  | { ok: true; user: User }
  | { ok: false; error: string };
