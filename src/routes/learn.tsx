import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, CloudSun, Hand, Hash, Star, Users, UtensilsCrossed } from "lucide-react";
import { minutesFor, nextIncomplete, units, type Unit } from "@/lib/curriculum";
import { useProgress } from "@/lib/progress";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/learn")({
  head: () => ({ meta: [{ title: "Banjoür — Lesson path" }] }),
  component: LearnPage,
});

const ICONS = {
  hand: Hand,
  hash: Hash,
  users: Users,
  utensils: UtensilsCrossed,
  cloud: CloudSun,
} as const;

function LearnPage() {
  const completed = useProgress((state) => state.completed);
  const upcoming = nextIncomplete(completed);

  return (
    <div className="flex flex-col gap-8">
      <header>
        <p className="text-xs font-extrabold tracking-widest text-sea uppercase">Lesson path</p>
        <h1 className="mt-1 font-display text-4xl font-semibold md:text-5xl">Five units to trial</h1>
        <p className="mt-2 max-w-2xl text-ink-soft">
          Every unit is open. Unit 1 is a full sample. The later units are shorter starter sets, ready
          to expand with approved texts.
        </p>
      </header>

      {units.map((unit, index) => (
        <UnitBlock
          key={unit.id}
          unit={unit}
          index={index}
          completed={completed}
          nextId={upcoming?.lesson.id ?? null}
        />
      ))}

      <p className="max-w-2xl text-sm font-semibold text-ink-soft">
        Sample phrases are drawn from published Guernesiais word lists, including public Language
        Commission materials. Parish spellings differ, and this set is ready to swap.
      </p>
    </div>
  );
}

function UnitBlock({
  unit,
  index,
  completed,
  nextId,
}: {
  unit: Unit;
  index: number;
  completed: Record<string, { stars: number }>;
  nextId: string | null;
}) {
  const Icon = ICONS[unit.icon];
  const finished = unit.lessons.filter((lesson) => completed[lesson.id]).length;
  return (
    <section id={unit.id} className="scroll-mt-24">
      <div className="mb-3 flex items-start gap-3">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-sea text-foam">
          <Icon className="h-6 w-6" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-xs font-extrabold tracking-widest text-sea uppercase">Unit {index + 1}</p>
            <span
              className={cn(
                "rounded-full px-2.5 py-1 text-xs font-extrabold",
                unit.depth === "full" ? "bg-sea-soft text-sea-deep" : "bg-sand-deep text-ink-soft",
              )}
            >
              {unit.depth === "full" ? "Full sample" : "Starter set"}
            </span>
          </div>
          <h2 className="font-display text-3xl font-semibold">{unit.title}</h2>
          <p className="text-sm font-semibold text-ink-soft">
            {unit.summary} {finished}/{unit.lessons.length} lessons.
          </p>
        </div>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-sand-deep">
        <div
          className="h-full rounded-full bg-sea"
          style={{ width: `${unit.lessons.length ? (finished / unit.lessons.length) * 100 : 0}%` }}
        />
      </div>
      <ol className="mt-3 flex flex-col gap-2">
        {unit.lessons.map((lesson, lessonIndex) => {
          const record = completed[lesson.id];
          const upNext = lesson.id === nextId;
          return (
            <li key={lesson.id}>
              <Link
                to="/lesson/$lessonId"
                params={{ lessonId: lesson.id }}
                className={cn(
                  "flex min-h-16 items-center gap-3 rounded-2xl border-2 px-3 py-3",
                  upNext ? "border-sea bg-sea-soft" : "border-line bg-foam",
                )}
              >
                <span
                  className={cn(
                    "grid h-10 w-10 shrink-0 place-items-center rounded-full text-sm font-extrabold",
                    record ? "bg-sea text-foam" : "bg-sand-deep text-ink",
                  )}
                  aria-hidden="true"
                >
                  {record ? <Check className="h-5 w-5" /> : lessonIndex + 1}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-extrabold">{lesson.title}</span>
                  <span className="block text-sm font-semibold text-ink-soft">
                    {lesson.summary} · {minutesFor(lesson.exercises.length)} min
                    {upNext ? " · Up next" : ""}
                  </span>
                </span>
                {record ? (
                  <span className="flex shrink-0" aria-label={`${record.stars} stars`}>
                    {[0, 1, 2].map((star) => (
                      <Star
                        key={star}
                        className={cn(
                          "h-4 w-4",
                          star < record.stars ? "fill-gold text-gold" : "text-sand-deep",
                        )}
                        aria-hidden="true"
                      />
                    ))}
                  </span>
                ) : (
                  <span className="shrink-0 text-sm font-extrabold text-sea">
                    {upNext ? "Start" : "Open"}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
