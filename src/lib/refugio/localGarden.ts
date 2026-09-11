const FAVORITES_KEY = "refugio-favorites";
const DIARY_KEY = "refugio-diary-entries";
const MEMORIES_KEY = "refugio-memories";

export type LocalDiaryEntry = { id: string; content: string; createdAt: string };
export type LocalMemory = { id: string; title: string; content: string; sourceType: "letter" | "advice" | "note"; createdAt: string };

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function loadLocalFavorites(): string[] {
  return readJson<string[]>(FAVORITES_KEY, []);
}

export function saveLocalFavorites(ids: string[]) {
  writeJson(FAVORITES_KEY, ids);
}

export function toggleLocalFavorite(id: string): string[] {
  const current = loadLocalFavorites();
  const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
  saveLocalFavorites(next);
  return next;
}

export function loadLocalDiary(): LocalDiaryEntry[] {
  return readJson<LocalDiaryEntry[]>(DIARY_KEY, []);
}

export function addLocalDiary(content: string): LocalDiaryEntry[] {
  const next = [{ id: `local-${Date.now()}`, content, createdAt: new Date().toISOString() }, ...loadLocalDiary()];
  writeJson(DIARY_KEY, next);
  return next;
}

export function loadLocalMemories(): LocalMemory[] {
  return readJson<LocalMemory[]>(MEMORIES_KEY, []);
}

export function addLocalMemory(memory: Omit<LocalMemory, "id" | "createdAt">): LocalMemory[] {
  const next = [{ id: `local-${Date.now()}`, createdAt: new Date().toISOString(), ...memory }, ...loadLocalMemories()];
  writeJson(MEMORIES_KEY, next);
  return next;
}
