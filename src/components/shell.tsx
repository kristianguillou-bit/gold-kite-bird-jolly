import { Link, useRouterState } from "@tanstack/react-router";
import { CircleUser, Flame, House, Route, Sparkles } from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { Wordmark } from "@/components/mark";
import { shownStreak, useProgress } from "@/lib/progress";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Home", icon: House },
  { to: "/learn", label: "Path", icon: Route },
  { to: "/profile", label: "Progress", icon: CircleUser },
] as const;

function activePath(path: string, to: string) {
  if (to === "/") return path === "/";
  return path === to || path.startsWith(`${to}/`);
}

export function AppShell({ children }: { children: ReactNode }) {
  const path = useRouterState({ select: (state) => state.location.pathname });
  const hydrated = useProgress((state) => state.hydrated);
  const xp = useProgress((state) => state.xp);
  const streak = useProgress((state) => state.streak);
  const lastPracticeDate = useProgress((state) => state.lastPracticeDate);
  const lesson = path.startsWith("/lesson");
  const days = shownStreak(streak, lastPracticeDate, hydrated);

  useEffect(() => {
    let live = true;
    void Promise.resolve(useProgress.persist.rehydrate()).then(() => {
      if (live) useProgress.setState({ hydrated: true });
    });
    return () => {
      live = false;
    };
  }, []);

  if (lesson) return <>{children}</>;

  return (
    <div className="min-h-dvh bg-sand text-ink">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-xl focus:bg-foam focus:px-3 focus:py-2"
      >
        Skip to content
      </a>
      <header className="sticky top-0 z-20 border-b border-line bg-foam/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3 md:px-6">
          <Link to="/" aria-label="Banjoür home">
            <Wordmark />
          </Link>
          <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
            {NAV.map((item) => {
              const on = activePath(path, item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  aria-current={on ? "page" : undefined}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-bold",
                    on ? "bg-sea-soft text-sea-deep" : "text-ink-soft",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center gap-2">
            <span className="inline-flex min-h-10 items-center gap-1 rounded-full bg-gold-soft px-3 text-sm font-extrabold text-gold tabular-nums">
              <Flame className="h-4 w-4" aria-hidden="true" />
              {days}
              <span className="sr-only">day streak</span>
            </span>
            <span className="inline-flex min-h-10 items-center gap-1 rounded-full bg-sea-soft px-3 text-sm font-extrabold text-sea-deep tabular-nums">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              {hydrated ? xp : 0}
              <span className="sr-only">XP</span>
            </span>
          </div>
        </div>
      </header>
      <main id="content" className="mx-auto w-full max-w-5xl px-4 pt-4 pb-28 md:px-6 md:pb-16">
        {children}
      </main>
      <nav
        className="tabbar fixed inset-x-0 bottom-0 z-30 border-t border-line bg-foam/95 backdrop-blur md:hidden"
        aria-label="Main"
      >
        <ul className="mx-auto grid max-w-lg grid-cols-3">
          {NAV.map((item) => {
            const on = activePath(path, item.to);
            const Icon = item.icon;
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  aria-current={on ? "page" : undefined}
                  className={cn(
                    "flex min-h-16 flex-col items-center justify-center gap-1 text-xs font-bold",
                    on ? "text-sea" : "text-ink-soft",
                  )}
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
