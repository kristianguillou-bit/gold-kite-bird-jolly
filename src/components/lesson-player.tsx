import { Link, useNavigate } from "@tanstack/react-router";
import { Check, RotateCcw, Star, Volume2, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { accepted, normalize, seededOrder } from "@/lib/answers";
import {
  findLesson,
  kindLabel,
  lessonAfter,
  type Exercise,
} from "@/lib/curriculum";
import { useProgress } from "@/lib/progress";
import { speak, stopSpeech } from "@/lib/speech";
import { cn } from "@/lib/utils";

type Grade = "first" | "second" | "miss";

type Done = {
  xp: number;
  stars: number;
  firsts: number;
  total: number;
  gain: number;
  streak: number;
  leveledUp: boolean;
  levelName: string;
  levelGloss: string;
};

function xpFor(grade: Grade) {
  if (grade === "first") return 10;
  if (grade === "second") return 6;
  return 2;
}

function answerText(exercise: Exercise) {
  if (exercise.kind === "choice" || exercise.kind === "tap" || exercise.kind === "listen") {
    return exercise.options[exercise.answer] ?? "";
  }
  if (exercise.kind === "type" || exercise.kind === "blank") return exercise.reveal;
  if (exercise.kind === "build") return exercise.answer.join(" ");
  return "";
}

export function LessonPlayer({ lessonId }: { lessonId: string }) {
  const found = findLesson(lessonId);
  if (!found) {
    return (
      <div className="lesson-shell grid place-items-center bg-sand px-6 text-center">
        <div>
          <h1 className="font-display text-3xl font-semibold">Lesson not found</h1>
          <Link to="/learn" className="mt-4 inline-flex font-bold text-sea">
            Back to the path
          </Link>
        </div>
      </div>
    );
  }
  return <Player unitTitle={found.unit.title} lesson={found.lesson} />;
}

function Player({
  unitTitle,
  lesson,
}: {
  unitTitle: string;
  lesson: NonNullable<ReturnType<typeof findLesson>>["lesson"];
}) {
  const navigate = useNavigate();
  const recordLesson = useProgress((state) => state.recordLesson);
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState<Grade[]>([]);
  const [done, setDone] = useState<Done | null>(null);
  const [leaveOpen, setLeaveOpen] = useState(false);
  const exercise = lesson.exercises[index];
  const running = results.reduce((sum, grade) => sum + xpFor(grade), 0);

  function finish(grades: Grade[]) {
    const xp = grades.reduce((sum, grade) => sum + xpFor(grade), 0);
    const firsts = grades.filter((grade) => grade === "first").length;
    const score = grades.reduce(
      (sum, grade) => sum + (grade === "first" ? 1 : grade === "second" ? 0.7 : 0.3),
      0,
    );
    const ratio = grades.length ? score / grades.length : 0;
    const stars = ratio >= 0.9 ? 3 : ratio >= 0.65 ? 2 : 1;
    const summary = recordLesson(lesson.id, { xp, stars, ratio });
    setDone({
      xp,
      stars,
      firsts,
      total: grades.length,
      gain: summary.gain,
      streak: summary.streak,
      leveledUp: summary.leveledUp,
      levelName: summary.levelName,
      levelGloss: summary.levelGloss,
    });
  }

  function goNext() {
    stopSpeech();
    if (index + 1 >= lesson.exercises.length) finish(results);
    else setIndex((value) => value + 1);
  }

  function restart() {
    stopSpeech();
    setDone(null);
    setResults([]);
    setIndex(0);
  }

  function requestLeave() {
    if (done || (results.length === 0 && index === 0)) {
      void navigate({ to: "/learn" });
      return;
    }
    setLeaveOpen(true);
  }

  const next = lessonAfter(lesson.id);

  return (
    <div className="lesson-shell flex flex-col bg-sand text-ink">
      <header className="shrink-0 border-b border-line bg-foam px-3 py-3 md:px-5">
        <div className="mx-auto flex w-full max-w-xl items-center gap-2">
          <button
            type="button"
            onClick={requestLeave}
            className="press grid h-11 w-11 shrink-0 place-items-center rounded-full text-ink"
            aria-label="Leave lesson"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-bold tracking-wide text-ink-soft uppercase">
              {unitTitle}
            </p>
            <p className="truncate text-sm font-extrabold">{lesson.title}</p>
          </div>
          <p className="text-sm font-extrabold text-gold tabular-nums">{running} XP</p>
          <button
            type="button"
            onClick={restart}
            className="press grid h-11 w-11 shrink-0 place-items-center rounded-full text-ink-soft"
            aria-label="Restart lesson"
          >
            <RotateCcw className="h-5 w-5" />
          </button>
        </div>
        <div
          className="mx-auto mt-3 flex w-full max-w-xl gap-1"
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={lesson.exercises.length}
          aria-valuenow={done ? lesson.exercises.length : index + 1}
          aria-label="Lesson progress"
        >
          {lesson.exercises.map((item, itemIndex) => (
            <span
              key={item.id}
              className={cn(
                "h-2 flex-1 rounded-full transition-colors duration-200",
                done || itemIndex < index
                  ? "bg-sea"
                  : itemIndex === index
                    ? "bg-gold"
                    : "bg-sand-deep",
              )}
            />
          ))}
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col">
        {done ? (
          <div className="min-h-0 flex-1 overflow-y-auto">
            <Complete done={done} lessonTitle={lesson.title} next={next} onRestart={restart} />
          </div>
        ) : exercise ? (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            showNote={index === 0 && Boolean(lesson.note)}
            note={lesson.note}
            onSolved={(grade) => setResults((current) => [...current, grade])}
            onContinue={goNext}
          />
        ) : null}
      </div>

      {leaveOpen ? (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-ink/40 px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="leave-title"
        >
          <div className="panel w-full max-w-sm p-6">
            <h2 id="leave-title" className="font-display text-3xl font-semibold">
              Leave this lesson?
            </h2>
            <p className="mt-2 text-ink-soft">
              This try will not be saved. You can start the lesson again any time.
            </p>
            <div className="mt-5 flex flex-col gap-2">
              <button
                type="button"
                className="press min-h-12 rounded-2xl bg-sea text-base font-extrabold text-foam"
                onClick={() => setLeaveOpen(false)}
              >
                Keep going
              </button>
              <Link
                to="/learn"
                className="press grid min-h-12 place-items-center rounded-2xl text-base font-bold text-ink-soft"
              >
                Leave lesson
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Complete({
  done,
  lessonTitle,
  next,
  onRestart,
}: {
  done: Done;
  lessonTitle: string;
  next: ReturnType<typeof lessonAfter>;
  onRestart: () => void;
}) {
  const headline = done.stars === 3 ? "Maunifik" : done.stars === 2 ? "Bian fait" : "You did it";
  const line =
    done.stars === 3
      ? "That was a sharp lesson."
      : done.stars === 2
        ? "Another short practice and it will stick."
        : "You finished the lesson. That is how the language grows.";

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center px-5 py-8 text-center">
      <p className="text-xs font-extrabold tracking-widest text-sea uppercase">Lesson complete</p>
      <h1 className="mt-2 font-display text-5xl font-semibold">{headline}</h1>
      <p className="mt-2 max-w-sm text-ink-soft">{line}</p>
      <p className="mt-1 text-sm font-bold text-ink-soft">{lessonTitle}</p>
      <div className="mt-4 flex gap-1" aria-label={`${done.stars} of 3 stars`}>
        {[0, 1, 2].map((star) => (
          <Star
            key={star}
            className={cn("h-8 w-8", star < done.stars ? "fill-gold text-gold" : "text-sand-deep")}
            aria-hidden="true"
          />
        ))}
      </div>
      <div className="mt-6 grid w-full grid-cols-3 gap-2">
        <Stat label="XP added" value={String(done.gain)} />
        <Stat label="First try" value={`${done.firsts}/${done.total}`} />
        <Stat label="Streak" value={`${done.streak}`} />
      </div>
      {done.leveledUp ? (
        <p className="mt-4 rounded-2xl bg-gold-soft px-4 py-3 text-sm font-bold text-ink">
          New level · {done.levelName}
          <span className="mt-1 block font-semibold text-ink-soft">{done.levelGloss}</span>
        </p>
      ) : null}
      <div className="mt-6 flex w-full flex-col gap-2">
        {next ? (
          <Link
            to="/lesson/$lessonId"
            params={{ lessonId: next.lesson.id }}
            className="press grid min-h-14 place-items-center rounded-2xl bg-sea px-4 text-lg font-extrabold text-foam"
          >
            Next: {next.lesson.title}
          </Link>
        ) : (
          <Link
            to="/learn"
            className="press grid min-h-14 place-items-center rounded-2xl bg-sea px-4 text-lg font-extrabold text-foam"
          >
            Back to the path
          </Link>
        )}
        <button
          type="button"
          onClick={onRestart}
          className="press min-h-12 rounded-2xl border-2 border-sea text-base font-extrabold text-sea"
        >
          Practise again
        </button>
        {next ? (
          <Link
            to="/learn"
            className="press grid min-h-12 place-items-center rounded-2xl text-base font-bold text-ink-soft"
          >
            Back to the path
          </Link>
        ) : null}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-foam px-2 py-3">
      <p className="font-display text-2xl font-semibold tabular-nums">{value}</p>
      <p className="text-xs font-bold text-ink-soft">{label}</p>
    </div>
  );
}

function ExerciseCard({
  exercise,
  showNote,
  note,
  onSolved,
  onContinue,
}: {
  exercise: Exercise;
  showNote: boolean;
  note?: string;
  onSolved: (grade: Grade) => void;
  onContinue: () => void;
}) {
  const [phase, setPhase] = useState<"answer" | "retry" | "correct" | "revealed">("answer");
  const [tries, setTries] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [struck, setStruck] = useState<number | null>(null);
  const [typed, setTyped] = useState("");
  const [builtIdx, setBuiltIdx] = useState<number[]>([]);
  const [heard, setHeard] = useState(false);
  const [showWords, setShowWords] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [shake, setShake] = useState(false);
  const [selLeft, setSelLeft] = useState<number | null>(null);
  const [badRight, setBadRight] = useState<number | null>(null);
  const [matched, setMatched] = useState<number[]>([]);
  const [matchMistakes, setMatchMistakes] = useState(0);
  const [lockedGrade, setLockedGrade] = useState<Grade | null>(null);
  const reported = useRef(false);

  const pool = useMemo(() => {
    if (exercise.kind !== "build") return [];
    const items = [
      ...exercise.answer.map((word) => ({ word })),
      ...exercise.extra.map((word) => ({ word })),
    ];
    return seededOrder(items.length, exercise.id).map((item) => items[item]!);
  }, [exercise]);

  const rightOrder = useMemo(() => {
    if (exercise.kind !== "match") return [];
    return seededOrder(exercise.pairs.length, exercise.id);
  }, [exercise]);

  useEffect(() => () => stopSpeech(), []);

  function play(text: string) {
    const ok = speak(text, () => setSpeaking(false));
    if (!ok) {
      setShowWords(true);
      setHeard(true);
      setSpeaking(false);
      return;
    }
    setSpeaking(true);
    setHeard(true);
  }

  function lock(grade: Grade) {
    if (!reported.current) {
      reported.current = true;
      onSolved(grade);
    }
    setLockedGrade(grade);
    setPhase(grade === "miss" ? "revealed" : "correct");
  }

  function finishAttempt(ok: boolean) {
    if (ok) lock(tries > 0 ? "second" : "first");
    else if (tries === 0) {
      setTries(1);
      setPhase("retry");
      setShake(true);
      if (picked !== null) setStruck(picked);
      setPicked(null);
    } else lock("miss");
  }

  function onCheck() {
    if (phase === "correct" || phase === "revealed") {
      onContinue();
      return;
    }
    if (exercise.kind === "choice" || exercise.kind === "tap" || exercise.kind === "listen") {
      if (picked === null) return;
      finishAttempt(picked === exercise.answer);
      return;
    }
    if (exercise.kind === "type" || exercise.kind === "blank") {
      if (!typed.trim()) return;
      finishAttempt(accepted(typed, exercise.accept));
      return;
    }
    if (exercise.kind === "build") {
      const words = builtIdx.map((item) => pool[item]?.word ?? "");
      if (words.length === 0) return;
      finishAttempt(normalize(words.join(" ")) === normalize(exercise.answer.join(" ")));
    }
  }

  function pickRight(pairIndex: number) {
    if (exercise.kind !== "match" || phase !== "answer") return;
    if (matched.includes(pairIndex) || selLeft === null) return;
    if (selLeft === pairIndex) {
      const nextMatched = [...matched, pairIndex];
      setMatched(nextMatched);
      setSelLeft(null);
      setBadRight(null);
      if (nextMatched.length === exercise.pairs.length) {
        lock(matchMistakes > 0 ? "second" : "first");
      }
    } else {
      setMatchMistakes((count) => count + 1);
      setBadRight(pairIndex);
      setSelLeft(null);
    }
  }

  const locked = phase === "correct" || phase === "revealed";
  const needsListen = exercise.kind === "listen" && !heard;
  const checkDisabled =
    !locked &&
    (needsListen ||
      ((exercise.kind === "choice" || exercise.kind === "tap" || exercise.kind === "listen") &&
        picked === null) ||
      ((exercise.kind === "type" || exercise.kind === "blank") && typed.trim() === "") ||
      (exercise.kind === "build" && builtIdx.length === 0));

  const tone =
    phase === "correct" ? "bg-sea-soft" : phase === "retry" ? "bg-coral-soft" : "bg-gold-soft";
  const title =
    phase === "retry"
      ? "Not quite"
      : lockedGrade === "second"
        ? "You got it"
        : phase === "revealed"
          ? "Here's the answer"
          : "That's right";
  const say =
    "say" in exercise ? exercise.say : undefined;
  const phonetic = "phonetic" in exercise ? exercise.phonetic : undefined;

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col">
      <div className="rise min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto flex w-full max-w-xl flex-col gap-4 px-4 py-5">
          <p className="text-xs font-extrabold tracking-widest text-sea uppercase">
            {kindLabel(exercise.kind)}
          </p>
          <h1 className="font-display text-3xl leading-tight font-semibold md:text-4xl">
            {exercise.prompt}
          </h1>
          {showNote && note ? (
            <p className="rounded-2xl bg-gold-soft px-3 py-2 text-sm font-semibold text-ink">{note}</p>
          ) : null}

          {exercise.kind === "listen" ? (
            <ListenPrompt
              say={exercise.say}
              speaking={speaking}
              showWords={showWords}
              onPlay={() => play(exercise.say)}
              onShow={() => {
                setShowWords(true);
                setHeard(true);
              }}
            />
          ) : null}

          <div className={cn(shake && "shake")} onAnimationEnd={() => setShake(false)}>
            {exercise.kind === "choice" || exercise.kind === "listen" ? (
              <div className="grid gap-2">
                {exercise.options.map((option, optionIndex) => (
                  <SelectButton
                    key={option}
                    label={option}
                    layout="row"
                    selected={picked === optionIndex}
                    correct={locked && optionIndex === exercise.answer}
                    wrong={
                      struck === optionIndex ||
                      (locked && picked === optionIndex && optionIndex !== exercise.answer)
                    }
                    disabled={locked || struck === optionIndex}
                    onClick={() => setPicked(optionIndex)}
                  />
                ))}
              </div>
            ) : null}

            {exercise.kind === "tap" ? (
              <div className="flex flex-wrap gap-2">
                {exercise.options.map((option, optionIndex) => (
                  <SelectButton
                    key={option}
                    label={option}
                    layout="chip"
                    selected={picked === optionIndex}
                    correct={locked && optionIndex === exercise.answer}
                    wrong={
                      struck === optionIndex ||
                      (locked && picked === optionIndex && optionIndex !== exercise.answer)
                    }
                    disabled={locked || struck === optionIndex}
                    onClick={() => setPicked(optionIndex)}
                  />
                ))}
              </div>
            ) : null}

            {exercise.kind === "match" ? (
              <MatchBoard
                exercise={exercise}
                rightOrder={rightOrder}
                matched={matched}
                locked={locked}
                selLeft={selLeft}
                badRight={badRight}
                onLeft={(pairIndex) => setSelLeft(pairIndex)}
                onRight={pickRight}
              />
            ) : null}

            {exercise.kind === "type" ? (
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  onCheck();
                }}
              >
                <label className="block text-sm font-bold text-ink-soft" htmlFor="answer">
                  Guernesiais
                </label>
                <input
                  id="answer"
                  value={typed}
                  readOnly={locked}
                  onChange={(event) => setTyped(event.target.value)}
                  autoCapitalize="off"
                  autoCorrect="off"
                  autoComplete="off"
                  spellCheck={false}
                  enterKeyHint="done"
                  placeholder="Type here"
                  className="mt-2 min-h-14 w-full rounded-2xl border-2 border-line bg-foam px-4 text-lg font-bold outline-none focus:border-sea"
                />
              </form>
            ) : null}

            {exercise.kind === "blank" ? (
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  onCheck();
                }}
                className="flex flex-wrap items-center gap-2 text-xl font-bold"
              >
                {exercise.before ? <span>{exercise.before}</span> : null}
                <label className="sr-only" htmlFor="gap">
                  Missing word
                </label>
                <input
                  id="gap"
                  value={typed}
                  readOnly={locked}
                  onChange={(event) => setTyped(event.target.value)}
                  autoCapitalize="off"
                  autoCorrect="off"
                  autoComplete="off"
                  spellCheck={false}
                  enterKeyHint="done"
                  className="min-h-14 min-w-32 flex-1 rounded-2xl border-2 border-line bg-foam px-3 text-center text-lg font-bold outline-none focus:border-sea"
                />
                {exercise.after ? <span>{exercise.after}</span> : null}
              </form>
            ) : null}

            {exercise.kind === "build" ? (
              <BuildBoard
                pool={pool}
                builtIdx={builtIdx}
                locked={locked}
                onAdd={(poolIndex) => setBuiltIdx((current) => [...current, poolIndex])}
                onRemove={(builtIndex) =>
                  setBuiltIdx((current) => current.filter((_, i) => i !== builtIndex))
                }
              />
            ) : null}
          </div>
        </div>
      </div>

      <div className="shrink-0 border-t border-line bg-foam px-4 py-3">
        <div className="mx-auto flex w-full max-w-xl flex-col gap-3">
          {phase !== "answer" ? (
            <div role="status" className={cn("rounded-2xl px-4 py-3", tone)}>
              <div className="flex items-start justify-between gap-3">
                <p className="font-extrabold">{title}</p>
                {lockedGrade ? (
                  <p className="font-extrabold text-gold tabular-nums">+{xpFor(lockedGrade)} XP</p>
                ) : null}
              </div>
              <p className="mt-1 text-sm font-semibold text-ink">
                {phase === "retry"
                  ? "Have another go."
                  : phase === "revealed"
                    ? `Answer: ${answerText(exercise)}. ${exercise.explain}`
                    : exercise.explain}
              </p>
              {locked && phonetic ? (
                <p className="mt-1 text-sm font-bold text-ink-soft">Sounds like “{phonetic}”.</p>
              ) : null}
              {locked && say ? (
                <button
                  type="button"
                  onClick={() => play(say)}
                  className="mt-2 inline-flex min-h-11 items-center gap-2 text-sm font-extrabold text-sea"
                >
                  <Volume2 className="h-4 w-4" aria-hidden="true" />
                  Hear it
                  <span className="font-semibold text-ink-soft">Practice voice</span>
                </button>
              ) : null}
            </div>
          ) : null}
          {exercise.kind === "match" && phase === "answer" ? (
            <p className="py-3 text-center text-sm font-bold text-ink-soft">
              Match every pair to continue
            </p>
          ) : (
            <button
              type="button"
              onClick={onCheck}
              disabled={checkDisabled}
              className="press min-h-14 rounded-2xl bg-sea text-lg font-extrabold text-foam disabled:bg-sand-deep disabled:text-ink-soft"
            >
              {locked ? "Continue" : "Check"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function ListenPrompt({
  say,
  speaking,
  showWords,
  onPlay,
  onShow,
}: {
  say: string;
  speaking: boolean;
  showWords: boolean;
  onPlay: () => void;
  onShow: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-3 py-2">
      <button
        type="button"
        onClick={onPlay}
        className={cn(
          "press grid h-24 w-24 place-items-center rounded-full bg-sea text-foam",
          speaking && "speaking",
        )}
        aria-label="Play the phrase with a practice voice. Not a native recording."
      >
        <Volume2 className="h-10 w-10" />
      </button>
      <p className="text-center text-sm font-semibold text-ink-soft">
        Practice voice · not a native Guernesiais recording
      </p>
      {showWords ? (
        <p className="font-display text-3xl font-semibold">{say}</p>
      ) : (
        <button type="button" className="min-h-11 text-sm font-extrabold text-sea" onClick={onShow}>
          Show the words
        </button>
      )}
    </div>
  );
}

function MatchBoard({
  exercise,
  rightOrder,
  matched,
  locked,
  selLeft,
  badRight,
  onLeft,
  onRight,
}: {
  exercise: Extract<Exercise, { kind: "match" }>;
  rightOrder: number[];
  matched: number[];
  locked: boolean;
  selLeft: number | null;
  badRight: number | null;
  onLeft: (index: number) => void;
  onRight: (index: number) => void;
}) {
  return (
    <div>
      <p className="mb-3 text-sm font-semibold text-ink-soft">
        Tap a phrase on the left, then its match on the right.
      </p>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-extrabold tracking-wide text-ink-soft uppercase">English</p>
          {exercise.pairs.map((pair, pairIndex) => {
            const donePair = matched.includes(pairIndex);
            return (
              <button
                key={pair.left}
                type="button"
                disabled={donePair || locked}
                onClick={() => onLeft(pairIndex)}
                className={cn(
                  "press min-h-14 rounded-2xl border-2 px-3 py-2 text-left text-sm font-bold",
                  donePair
                    ? "border-sea bg-sea-soft text-sea-deep"
                    : selLeft === pairIndex
                      ? "border-sea bg-sea text-foam"
                      : "border-line bg-foam",
                )}
              >
                {pair.left}
              </button>
            );
          })}
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-xs font-extrabold tracking-wide text-ink-soft uppercase">Guernesiais</p>
          {rightOrder.map((pairIndex) => {
            const pair = exercise.pairs[pairIndex];
            if (!pair) return null;
            const donePair = matched.includes(pairIndex);
            return (
              <button
                key={pair.right}
                type="button"
                disabled={donePair || locked}
                onClick={() => onRight(pairIndex)}
                className={cn(
                  "press min-h-14 rounded-2xl border-2 px-3 py-2 text-left text-sm font-bold",
                  donePair
                    ? "border-sea bg-sea-soft text-sea-deep"
                    : badRight === pairIndex
                      ? "border-coral bg-coral-soft"
                      : "border-line bg-foam",
                )}
              >
                {pair.right}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function BuildBoard({
  pool,
  builtIdx,
  locked,
  onAdd,
  onRemove,
}: {
  pool: { word: string }[];
  builtIdx: number[];
  locked: boolean;
  onAdd: (index: number) => void;
  onRemove: (index: number) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex min-h-20 flex-wrap gap-2 rounded-2xl border-2 border-dashed border-line bg-foam p-3">
        {builtIdx.length === 0 ? (
          <span className="text-sm font-semibold text-ink-soft">Tap the words below</span>
        ) : (
          builtIdx.map((poolIndex, builtIndex) => (
            <button
              key={`${poolIndex}-${builtIndex}`}
              type="button"
              disabled={locked}
              onClick={() => onRemove(builtIndex)}
              className="press min-h-11 rounded-xl bg-sea px-3 text-base font-extrabold text-foam"
            >
              {pool[poolIndex]?.word}
            </button>
          ))
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {pool.map((item, poolIndex) => {
          const used = builtIdx.includes(poolIndex);
          return (
            <button
              key={`${item.word}-${poolIndex}`}
              type="button"
              disabled={used || locked}
              onClick={() => onAdd(poolIndex)}
              className={cn(
                "press min-h-12 rounded-full border-2 px-4 text-base font-extrabold",
                used ? "border-transparent bg-sand-deep text-ink-soft" : "border-line bg-foam",
              )}
            >
              {item.word}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SelectButton({
  label,
  layout,
  selected,
  correct,
  wrong,
  disabled,
  onClick,
}: {
  label: string;
  layout: "row" | "chip";
  selected: boolean;
  correct: boolean;
  wrong: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "press border-2 text-left font-bold",
        layout === "row"
          ? "flex min-h-14 w-full items-center gap-3 rounded-2xl px-4 py-3 text-base"
          : "min-h-12 rounded-full px-4 text-base",
        correct
          ? "border-sea bg-sea-soft text-sea-deep"
          : wrong
            ? "border-coral bg-coral-soft text-coral"
            : selected
              ? "border-sea bg-sea text-foam"
              : "border-line bg-foam text-ink",
      )}
    >
      {layout === "row" ? (
        <span
          className={cn(
            "grid h-7 w-7 shrink-0 place-items-center rounded-full border-2",
            correct || selected ? "border-current" : "border-line",
          )}
          aria-hidden="true"
        >
          {correct ? <Check className="h-4 w-4" /> : null}
        </span>
      ) : null}
      <span className="safe-wrap">{label}</span>
    </button>
  );
}
