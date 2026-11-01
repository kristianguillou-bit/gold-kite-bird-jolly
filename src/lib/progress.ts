import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CompletedLesson = {
  stars: number;
  ratio: number;
  xp: number;
  at: string;
};

type LessonPayload = {
  xp: number;
  stars: number;
  ratio: number;
};

type RecordResult = {
  gain: number;
  first: boolean;
  streak: number;
  leveledUp: boolean;
  levelName: string;
  levelGloss: string;
};

type ProgressState = {
  xp: number;
  streak: number;
  lastPracticeDate: string | null;
  practiceDates: string[];
  dailyXp: Record<string, number>;
  dailyGoal: number;
  displayName: string;
  completed: Record<string, CompletedLesson>;
  hydrated: boolean;
  setDisplayName: (name: string) => void;
  setDailyGoal: (goal: number) => void;
  recordLesson: (lessonId: string, payload: LessonPayload) => RecordResult;
  reset: () => void;
};

const initial = {
  xp: 0,
  streak: 0,
  lastPracticeDate: null as string | null,
  practiceDates: [] as string[],
  dailyXp: {} as Record<string, number>,
  dailyGoal: 20,
  displayName: "Learner",
  completed: {} as Record<string, CompletedLesson>,
};

export const LEVELS = [
  { name: "Bianvnu", gloss: "Welcome" },
  { name: "Pas trop mal", gloss: "Finding your feet" },
  { name: "V'la qui vaout", gloss: "That's the way" },
  { name: "Bian fait", gloss: "Well done" },
  { name: "Maunifik", gloss: "Wonderful" },
] as const;

const LEVEL_XP = [0, 50, 120, 220, 360];

export function levelIndex(xp: number) {
  let index = 0;
  for (let i = 0; i < LEVEL_XP.length; i++) {
    if (xp >= LEVEL_XP[i]!) index = i;
  }
  return index;
}

export function levelProgress(xp: number) {
  const index = levelIndex(xp);
  const start = LEVEL_XP[index]!;
  const end = LEVEL_XP[index + 1] ?? start + 160;
  const level = LEVELS[index]!;
  const span = Math.max(1, end - start);
  return {
    index,
    level,
    start,
    end,
    into: Math.min(1, (xp - start) / span),
    atTop: index === LEVELS.length - 1,
  };
}

export function todayKey(offset = 0) {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + offset);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function shownStreak(streak: number, last: string | null, ready: boolean) {
  if (!ready || !last) return 0;
  if (last === todayKey(0) || last === todayKey(-1)) return streak;
  return 0;
}

function pruneDaily(daily: Record<string, number>) {
  const keepFrom = todayKey(-21);
  const next: Record<string, number> = {};
  for (const [key, value] of Object.entries(daily)) {
    if (key >= keepFrom) next[key] = value;
  }
  return next;
}

export const useProgress = create<ProgressState>()(
  persist(
    (set, get) => ({
      ...initial,
      hydrated: false,
      setDisplayName: (name) =>
        set({ displayName: name.replace(/[<>]/g, "").slice(0, 24) }),
      setDailyGoal: (goal) => set({ dailyGoal: goal }),
      reset: () => set({ ...initial, hydrated: true }),
      recordLesson: (lessonId, payload) => {
        const state = get();
        const prev = state.completed[lessonId];
        const first = !prev;
        const gain = first ? payload.xp : Math.max(4, Math.round(payload.xp * 0.35));
        const today = todayKey(0);
        const yesterday = todayKey(-1);
        let streak = state.streak;
        if (state.lastPracticeDate === today) {
          streak = Math.max(1, state.streak);
        } else if (state.lastPracticeDate === yesterday) {
          streak = state.streak + 1;
        } else {
          streak = 1;
        }
        const before = levelIndex(state.xp);
        const xp = state.xp + gain;
        const after = levelIndex(xp);
        const practiceDates = state.practiceDates.includes(today)
          ? state.practiceDates
          : [...state.practiceDates, today].slice(-60);
        const dailyXp = pruneDaily({
          ...state.dailyXp,
          [today]: (state.dailyXp[today] ?? 0) + gain,
        });
        const level = LEVELS[after]!;
        set({
          xp,
          streak,
          lastPracticeDate: today,
          practiceDates,
          dailyXp,
          completed: {
            ...state.completed,
            [lessonId]: {
              stars: Math.max(prev?.stars ?? 0, payload.stars),
              ratio: Math.max(prev?.ratio ?? 0, payload.ratio),
              xp: (prev?.xp ?? 0) + gain,
              at: new Date().toISOString(),
            },
          },
        });
        return {
          gain,
          first,
          streak,
          leveledUp: after > before,
          levelName: level.name,
          levelGloss: level.gloss,
        };
      },
    }),
    {
      name: "banjour-progress-v1",
      skipHydration: true,
      partialize: (state) => ({
        xp: state.xp,
        streak: state.streak,
        lastPracticeDate: state.lastPracticeDate,
        practiceDates: state.practiceDates,
        dailyXp: state.dailyXp,
        dailyGoal: state.dailyGoal,
        displayName: state.displayName,
        completed: state.completed,
      }),
    },
  ),
);

export function useHydrateProgress() {
  const hydrated = useProgress((state) => state.hydrated);
  return hydrated;
}
