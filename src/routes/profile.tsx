import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { lessonCount, units } from "@/lib/curriculum";
import { levelProgress, shownStreak, todayKey, useProgress } from "@/lib/progress";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Banjoür — Progress" }] }),
  component: ProfilePage,
});

const GOALS = [20, 30, 50];

function ProfilePage() {
  const hydrated = useProgress((state) => state.hydrated);
  const xp = useProgress((state) => state.xp);
  const streak = useProgress((state) => state.streak);
  const last = useProgress((state) => state.lastPracticeDate);
  const displayName = useProgress((state) => state.displayName);
  const setDisplayName = useProgress((state) => state.setDisplayName);
  const dailyGoal = useProgress((state) => state.dailyGoal);
  const setDailyGoal = useProgress((state) => state.setDailyGoal);
  const completed = useProgress((state) => state.completed);
  const practiceDates = useProgress((state) => state.practiceDates);
  const reset = useProgress((state) => state.reset);
  const [confirm, setConfirm] = useState(false);

  const level = levelProgress(hydrated ? xp : 0);
  const days = shownStreak(streak, last, hydrated);
  const total = lessonCount();
  const doneCount = Object.keys(completed).length;
  const initial = (displayName.trim()[0] ?? "L").toUpperCase();

  const daysOfWeek = Array.from({ length: 7 }, (_, index) => {
    const offset = index - 6;
    const key = todayKey(offset);
    const date = new Date();
    date.setDate(date.getDate() + offset);
    return {
      key,
      label: date.toLocaleDateString("en-GB", { weekday: "narrow" }),
      on: hydrated && practiceDates.includes(key),
      today: offset === 0,
    };
  });

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4">
      <header className="panel flex items-center gap-4 p-5">
        <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-sea font-display text-3xl font-semibold text-foam">
          {initial}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-extrabold tracking-widest text-sea uppercase">This device</p>
          <h1 className="font-display text-4xl font-semibold">Your progress</h1>
          <p className="text-sm font-semibold text-ink-soft">
            Level {level.index + 1} · {level.level.name} · {level.level.gloss}
          </p>
        </div>
      </header>

      <section className="grid gap-3 sm:grid-cols-3">
        <Tile label="Total XP" value={String(hydrated ? xp : 0)} />
        <Tile label="Day streak" value={String(days)} />
        <Tile label="Lessons" value={`${doneCount}/${total}`} />
      </section>

      <section className="panel p-5">
        <h2 className="font-display text-2xl font-semibold">This week</h2>
        <p className="text-sm font-semibold text-ink-soft">
          Days with at least one finished lesson on this device.
        </p>
        {hydrated ? (
          <ol className="mt-4 grid grid-cols-7 gap-2">
            {daysOfWeek.map((day) => (
              <li key={day.key} className="text-center">
                <span
                  className={
                    day.on
                      ? "mx-auto grid h-10 w-10 place-items-center rounded-full bg-sea text-sm font-extrabold text-foam"
                      : "mx-auto grid h-10 w-10 place-items-center rounded-full bg-sand-deep text-sm font-extrabold text-ink-soft"
                  }
                >
                  {day.label}
                </span>
                {day.today ? <span className="mt-1 block text-xs font-bold text-sea">Today</span> : null}
              </li>
            ))}
          </ol>
        ) : (
          <div className="mt-4 h-10 rounded-full bg-sand-deep" />
        )}
      </section>

      <section className="panel p-5">
        <h2 className="font-display text-2xl font-semibold">Units</h2>
        <p className="mb-4 text-sm font-semibold text-ink-soft">
          Useful on a projector: how far this device has got through the sample path.
        </p>
        <ul className="flex flex-col gap-4">
          {units.map((unit, index) => {
            const finished = unit.lessons.filter((lesson) => completed[lesson.id]).length;
            const width = unit.lessons.length ? (finished / unit.lessons.length) * 100 : 0;
            return (
              <li key={unit.id}>
                <div className="mb-1 flex items-baseline justify-between gap-3">
                  <p className="font-extrabold">
                    <span className="text-ink-soft">{index + 1}.</span> {unit.title}
                  </p>
                  <p className="text-sm font-bold text-ink-soft tabular-nums">
                    {finished}/{unit.lessons.length}
                  </p>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-sand-deep">
                  <div className="h-full rounded-full bg-sea" style={{ width: `${width}%` }} />
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="panel p-5">
        <h2 className="font-display text-2xl font-semibold">Name on this device</h2>
        <label className="mt-3 block text-sm font-bold text-ink-soft" htmlFor="learner-name">
          Shown on the home screen. Nothing is sent to an account.
        </label>
        <input
          id="learner-name"
          value={displayName}
          maxLength={24}
          onChange={(event) => setDisplayName(event.target.value)}
          onBlur={() => {
            if (!displayName.trim()) setDisplayName("Learner");
            else setDisplayName(displayName.trim());
          }}
          className="mt-2 min-h-12 w-full rounded-2xl border-2 border-line bg-foam px-4 text-lg font-bold outline-none focus:border-sea"
        />
        <p className="mt-4 text-sm font-bold text-ink">Daily goal</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {GOALS.map((goal) => (
            <button
              key={goal}
              type="button"
              aria-pressed={dailyGoal === goal}
              onClick={() => setDailyGoal(goal)}
              className={
                dailyGoal === goal
                  ? "min-h-11 rounded-full bg-sea px-4 text-sm font-extrabold text-foam"
                  : "min-h-11 rounded-full bg-sand-deep px-4 text-sm font-extrabold text-ink"
              }
            >
              {goal} XP
            </button>
          ))}
        </div>
      </section>

      <section className="panel p-5">
        <h2 className="font-display text-2xl font-semibold">About these lessons</h2>
        <p className="mt-2 text-ink-soft">
          Guernesiais is the Norman language of Guernsey, also called Guernsey French or Patois. The
          trial uses short sample lessons so a class can try the activity. Words can be replaced with
          texts approved for school. There is no account in this demo: stars, XP and the streak stay
          in this browser.
        </p>
        <p className="mt-3 text-sm font-semibold text-ink-soft">
          The listen button uses the device’s French voice as a placeholder. It is not a Guernesiais
          recording.
        </p>
      </section>

      <section className="px-1 pb-4">
        {confirm ? (
          <div className="panel p-5">
            <h2 className="font-display text-2xl font-semibold">Clear progress?</h2>
            <p className="mt-2 text-sm font-semibold text-ink-soft">
              This removes XP, the streak and lesson stars on this device.
            </p>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                className="press min-h-12 flex-1 rounded-2xl bg-coral text-base font-extrabold text-foam"
                onClick={() => {
                  reset();
                  setConfirm(false);
                }}
              >
                Clear progress
              </button>
              <button
                type="button"
                className="press min-h-12 flex-1 rounded-2xl border-2 border-line text-base font-bold"
                onClick={() => setConfirm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirm(true)}
            className="min-h-12 text-sm font-extrabold text-coral"
          >
            Reset progress on this device
          </button>
        )}
      </section>
    </div>
  );
}

function Tile({ label, value }: { label: string; value: string }) {
  return (
    <article className="panel p-4">
      <p className="text-xs font-extrabold tracking-widest text-ink-soft uppercase">{label}</p>
      <p className="font-display text-3xl font-semibold tabular-nums">{value}</p>
    </article>
  );
}
