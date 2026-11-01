import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  lessonCount,
  minutesFor,
  nextIncomplete,
  units,
} from "@/lib/curriculum";
import { levelProgress, shownStreak, todayKey, useProgress } from "@/lib/progress";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Banjoür — Home" }] }),
  component: HomePage,
});

function HomePage() {
  const hydrated = useProgress((state) => state.hydrated);
  const xp = useProgress((state) => state.xp);
  const streak = useProgress((state) => state.streak);
  const last = useProgress((state) => state.lastPracticeDate);
  const dailyXp = useProgress((state) => state.dailyXp);
  const dailyGoal = useProgress((state) => state.dailyGoal);
  const displayName = useProgress((state) => state.displayName);
  const completed = useProgress((state) => state.completed);
  const [greet, setGreet] = useState("Banjoür");

  useEffect(() => {
    setGreet(new Date().getHours() >= 18 ? "Bon souer" : "Banjoür");
  }, []);

  const upcoming = nextIncomplete(completed);
  const total = lessonCount();
  const doneCount = units.reduce(
    (sum, unit) => sum + unit.lessons.filter((lesson) => completed[lesson.id]).length,
    0,
  );
  const days = shownStreak(streak, last, hydrated);
  const today = hydrated ? (dailyXp[todayKey()] ?? 0) : 0;
  const level = levelProgress(hydrated ? xp : 0);
  const name = displayName.trim();
  const named = name.length > 0 && name !== "Learner";

  return (
    <div className="flex flex-col gap-4">
      <section className="panel overflow-hidden">
        <div className="bg-sea px-5 py-6 text-foam md:px-8 md:py-8">
          <p className="text-sm font-extrabold tracking-wide">Guernesiais for Guernsey schools</p>
          <h1 className="mt-2 font-display text-5xl font-semibold tracking-tight md:text-6xl">
            {greet}
            {named ? `, ${name}` : ""}
          </h1>
          <p className="mt-2 max-w-lg text-base font-semibold text-foam">
            {greet === "Bon souer" ? "Good evening." : "Good day."} Short lessons you can finish in a
            tutor group.
          </p>
        </div>
        <div className="h-1 bg-gold" />
        <div className="flex flex-col gap-4 p-5 md:flex-row md:items-end md:justify-between md:p-6">
          <div className="min-w-0">
            <p className="text-xs font-extrabold tracking-widest text-sea uppercase">
              {upcoming ? "Up next" : "Path complete"}
            </p>
            <h2 className="mt-1 font-display text-3xl font-semibold">
              {upcoming ? upcoming.lesson.title : "Practise any lesson again"}
            </h2>
            <p className="mt-1 text-sm font-semibold text-ink-soft">
              {upcoming
                ? `${upcoming.unit.title} · ${upcoming.lesson.exercises.length} exercises · about ${minutesFor(upcoming.lesson.exercises.length)} min`
                : "You have finished every sample lesson on this device."}
            </p>
          </div>
          <Link
            to="/lesson/$lessonId"
            params={{ lessonId: upcoming?.lesson.id ?? "hello" }}
            className="press grid min-h-14 shrink-0 place-items-center rounded-2xl bg-sea px-6 text-lg font-extrabold text-foam md:min-w-52"
          >
            {doneCount === 0 ? "Start lesson" : upcoming ? "Continue" : "Practise again"}
          </Link>
        </div>
      </section>

      <div className="grid gap-3 sm:grid-cols-3">
        <article className="panel flex items-center gap-3 p-4">
          <Ring value={today} max={dailyGoal} />
          <div>
            <p className="text-xs font-extrabold tracking-widest text-ink-soft uppercase">Today</p>
            <p className="font-display text-2xl font-semibold tabular-nums">
              {today}
              <span className="text-base text-ink-soft">/{dailyGoal}</span>
            </p>
            <p className="text-sm font-semibold text-ink-soft">XP towards the daily goal</p>
          </div>
        </article>
        <article className="panel p-4">
          <p className="text-xs font-extrabold tracking-widest text-ink-soft uppercase">Streak</p>
          <p className="font-display text-2xl font-semibold tabular-nums">
            {days} {days === 1 ? "day" : "days"}
          </p>
          <p className="text-sm font-semibold text-ink-soft">
            {days === 0 ? "Finish a lesson to start one." : "Come back tomorrow to keep it."}
          </p>
        </article>
        <article className="panel p-4">
          <p className="text-xs font-extrabold tracking-widest text-ink-soft uppercase">
            Level {level.index + 1}
          </p>
          <p className="font-display text-2xl font-semibold">{level.level.name}</p>
          <p className="text-sm font-semibold text-ink-soft">{level.level.gloss}</p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-sand-deep">
            <div className="h-full rounded-full bg-sea" style={{ width: `${Math.round(level.into * 100)}%` }} />
          </div>
        </article>
      </div>

      <section>
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-3xl font-semibold">The path</h2>
            <p className="text-sm font-semibold text-ink-soft">
              {doneCount} of {total} lessons finished on this device
            </p>
          </div>
          <Link to="/learn" className="text-sm font-extrabold text-sea">
            Open the path
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {units.map((unit, index) => {
            const finished = unit.lessons.filter((lesson) => completed[lesson.id]).length;
            return (
              <Link
                key={unit.id}
                to="/learn"
                hash={unit.id}
                className="panel flex flex-col gap-2 p-4"
              >
                <p className="text-xs font-extrabold tracking-widest text-sea uppercase">
                  Unit {index + 1}
                </p>
                <p className="font-display text-xl font-semibold leading-tight">{unit.title}</p>
                <p className="mt-auto text-sm font-bold text-ink-soft tabular-nums">
                  {finished}/{unit.lessons.length}
                </p>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function Ring({ value, max }: { value: number; max: number }) {
  const radius = 28;
  const circ = 2 * Math.PI * radius;
  const progress = Math.min(1, max === 0 ? 0 : value / max);
  return (
    <svg viewBox="0 0 72 72" className="h-20 w-20 shrink-0" aria-hidden="true">
      <circle cx="36" cy="36" r={radius} fill="none" stroke="var(--color-sand-deep)" strokeWidth="8" />
      <circle
        cx="36"
        cy="36"
        r={radius}
        fill="none"
        stroke="var(--color-sea)"
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={`${circ * progress} ${circ}`}
        transform="rotate(-90 36 36)"
      />
    </svg>
  );
}
