import bcrypt from 'bcryptjs';
import {
  STORAGE_KEYS,
  readJSON,
  writeJSON,
  removeKey,
  getSessionStore,
} from '@/utils/storage';
import type {
  AuthResult,
  LoginInput,
  Session,
  SignupInput,
  StoredUser,
  User,
} from '@/types/auth.types';

/**
 * Authentication service — all auth business logic lives here, decoupled from
 * React. The UI only ever calls these functions, so moving to a real backend
 * means re-implementing this file against HTTP instead of LocalStorage.
 *
 * SECURITY NOTE: client-side bcrypt hashing is for a local prototype only.
 * Anyone with browser access can read/modify LocalStorage. This is NOT
 * production-grade authentication.
 */

const SALT_ROUNDS = 10;

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function toPublicUser(user: StoredUser): User {
  const { passwordHash: _passwordHash, ...rest } = user;
  return rest;
}

function getUsers(): StoredUser[] {
  const users = readJSON<StoredUser[]>(STORAGE_KEYS.users, []);
  return Array.isArray(users) ? users : [];
}

function saveUsers(users: StoredUser[]): void {
  writeJSON(STORAGE_KEYS.users, users);
}

function createId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `u_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

/** Register a new user, then auto-create a session (auto-login). */
export async function signup(input: SignupInput): Promise<AuthResult> {
  const email = normalizeEmail(input.email);
  const users = getUsers();

  if (users.some((u) => u.email === email)) {
    return { ok: false, error: 'An account with this email already exists.' };
  }

  const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);
  const user: StoredUser = {
    id: createId(),
    fullName: input.fullName.trim(),
    email,
    passwordHash,
    createdAt: new Date().toISOString(),
  };

  saveUsers([...users, user]);
  // New accounts are remembered by default after signup.
  setSession(user.id, true);

  return { ok: true, user: toPublicUser(user) };
}

/** Verify credentials and open a session. */
export async function login(input: LoginInput): Promise<AuthResult> {
  const email = normalizeEmail(input.email);
  const users = getUsers();
  const user = users.find((u) => u.email === email);

  // Generic message so we don't reveal whether the email exists.
  const invalid: AuthResult = {
    ok: false,
    error: 'Invalid email or password.',
  };

  if (!user) return invalid;

  const match = await bcrypt.compare(input.password, user.passwordHash);
  if (!match) return invalid;

  setSession(user.id, input.remember);
  return { ok: true, user: toPublicUser(user) };
}

/** Clear the session but keep registered accounts intact. */
export function logout(): void {
  removeKey(STORAGE_KEYS.session);
  const sessionStore = getSessionStore();
  if (sessionStore) removeKey(STORAGE_KEYS.session, sessionStore);
}

/**
 * Persist the session. When "remember me" is on we use localStorage so the
 * session survives a browser restart; otherwise sessionStorage so it is cleared
 * when the browser/tab closes. Either way it survives a page refresh.
 */
function setSession(userId: string, remember: boolean): void {
  const session: Session = {
    userId,
    remember,
    createdAt: new Date().toISOString(),
  };

  // Clear any previous session from both stores before writing the new one.
  logout();

  if (remember) {
    writeJSON(STORAGE_KEYS.session, session);
  } else {
    const sessionStore = getSessionStore();
    writeJSON(STORAGE_KEYS.session, session, sessionStore ?? localStorage);
  }
}

export function getSession(): Session | null {
  const persistent = readJSON<Session | null>(STORAGE_KEYS.session, null);
  if (persistent) return persistent;

  const sessionStore = getSessionStore();
  if (sessionStore) {
    return readJSON<Session | null>(STORAGE_KEYS.session, null, sessionStore);
  }
  return null;
}

/** Resolve the current session to a public user, or null if none/stale. */
export function getCurrentUser(): User | null {
  const session = getSession();
  if (!session) return null;

  const user = getUsers().find((u) => u.id === session.userId);
  if (!user) {
    // Session points at a deleted user — clean it up.
    logout();
    return null;
  }
  return toPublicUser(user);
}
