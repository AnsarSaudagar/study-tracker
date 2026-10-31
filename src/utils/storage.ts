/**
 * Centralized, typed LocalStorage access.
 *
 * No other module should touch window.localStorage directly. This keeps the
 * persistence concern in one place and makes it trivial to swap for a backend
 * API later (replace the bodies here / in authService with network calls).
 */

export const STORAGE_KEYS = {
  users: 'study_tracker_users',
  session: 'study_tracker_session',
  preferences: 'study_tracker_preferences',
  subjects: 'study_tracker_subjects',
  tasks: 'study_tracker_tasks',
} as const;

function safeStore(store: Storage): Storage | null {
  try {
    return store;
  } catch {
    return null;
  }
}

/** Read + JSON-parse a key, returning a fallback on missing/corrupted data. */
export function readJSON<T>(key: string, fallback: T, store: Storage = localStorage): T {
  try {
    const raw = store.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    // Corrupted entry — drop it so the app can recover instead of crashing.
    try {
      store.removeItem(key);
    } catch {
      /* ignore */
    }
    return fallback;
  }
}

/** JSON-serialize + write a key. Swallows quota/availability errors. */
export function writeJSON<T>(key: string, value: T, store: Storage = localStorage): void {
  try {
    store.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable (private mode / quota) — non-fatal for a prototype */
  }
}

export function removeKey(key: string, store: Storage = localStorage): void {
  try {
    store.removeItem(key);
  } catch {
    /* ignore */
  }
}

/** Access sessionStorage safely (may be unavailable in some contexts). */
export function getSessionStore(): Storage | null {
  return typeof sessionStorage !== 'undefined' ? safeStore(sessionStorage) : null;
}
