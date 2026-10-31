import { STORAGE_KEYS, readJSON, writeJSON } from '@/utils/storage';
import type { Preferences, Theme } from '@/types/auth.types';

/** User preferences (theme) persisted in LocalStorage. */

const DEFAULT: Preferences = { theme: 'light' };

export function getPreferences(): Preferences {
  const prefs = readJSON<Preferences>(STORAGE_KEYS.preferences, DEFAULT);
  return prefs?.theme ? prefs : DEFAULT;
}

export function setTheme(theme: Theme): void {
  writeJSON(STORAGE_KEYS.preferences, { ...getPreferences(), theme });
}
