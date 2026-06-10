/**
 * Storage abstraction layer.
 *
 * All persistence in the app goes through this adapter so the backing store
 * can be swapped (e.g. for Supabase) without touching feature code. A future
 * SupabaseAdapter implements the same interface and syncs writes to Postgres,
 * keeping localStorage as the offline cache.
 */

export interface StorageAdapter {
  get<T>(key: string, fallback: T): T;
  set(key: string, value: unknown): void;
  remove(key: string): void;
  clearAll(): void;
}

const PREFIX = 'mindforge-';

class LocalStorageAdapter implements StorageAdapter {
  get<T>(key: string, fallback: T): T {
    try {
      const raw = localStorage.getItem(PREFIX + key);
      return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
      return fallback;
    }
  }

  set(key: string, value: unknown): void {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
    } catch {
      // Quota exceeded or storage unavailable — fail silently for now.
    }
  }

  remove(key: string): void {
    try {
      localStorage.removeItem(PREFIX + key);
    } catch {}
  }

  clearAll(): void {
    try {
      Object.keys(localStorage)
        .filter(k => k.startsWith(PREFIX))
        .forEach(k => localStorage.removeItem(k));
    } catch {}
  }
}

export const storage: StorageAdapter = new LocalStorageAdapter();
