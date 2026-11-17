// localStorage throws when a browser blocks site storage (some private modes, "block all cookies").
// These treat that as nothing stored, so the app keeps working without remembering things.
export function readStorage(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeStorage(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Not remembered this time.
  }
}

export function removeStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    // Nothing to remove when storage is blocked.
  }
}
