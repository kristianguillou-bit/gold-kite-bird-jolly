import { i as __toESM } from "../_runtime.mjs";
import { C as require_jsx_runtime, Y as require_react, b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as levelProgress, c as shownStreak, d as useProgress, i as lessonCount, l as todayKey, o as minutesFor, s as nextIncomplete, u as units } from "./curriculum-DrPjxvcR.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CTtv10Sc.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function HomePage() {
	const hydrated = useProgress((state) => state.hydrated);
	const xp = useProgress((state) => state.xp);
	const streak = useProgress((state) => state.streak);
	const last = useProgress((state) => state.lastPracticeDate);
	const dailyXp = useProgress((state) => state.dailyXp);
	const dailyGoal = useProgress((state) => state.dailyGoal);
	const displayName = useProgress((state) => state.displayName);
	const completed = useProgress((state) => state.completed);
	const [greet, setGreet] = (0, import_react.useState)("Banjoür");
	(0, import_react.useEffect)(() => {
		setGreet((/* @__PURE__ */ new Date()).getHours() >= 18 ? "Bon souer" : "Banjoür");
	}, []);
	const upcoming = nextIncomplete(completed);
	const total = lessonCount();
	const doneCount = units.reduce((sum, unit) => sum + unit.lessons.filter((lesson) => completed[lesson.id]).length, 0);
	const days = shownStreak(streak, last, hydrated);
	const today = hydrated ? dailyXp[todayKey()] ?? 0 : 0;
	const level = levelProgress(hydrated ? xp : 0);
	const name = displayName.trim();
	const named = name.length > 0 && name !== "Learner";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "panel overflow-hidden",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-sea px-5 py-6 text-foam md:px-8 md:py-8",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-extrabold tracking-wide",
								children: "Guernesiais for Guernsey schools"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
								className: "mt-2 font-display text-5xl font-semibold tracking-tight md:text-6xl",
								children: [greet, named ? `, ${name}` : ""]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 max-w-lg text-base font-semibold text-foam",
								children: [greet === "Bon souer" ? "Good evening." : "Good day.", " Short lessons you can finish in a tutor group."]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-1 bg-gold" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-4 p-5 md:flex-row md:items-end md:justify-between md:p-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-extrabold tracking-widest text-sea uppercase",
									children: upcoming ? "Up next" : "Path complete"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "mt-1 font-display text-3xl font-semibold",
									children: upcoming ? upcoming.lesson.title : "Practise any lesson again"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm font-semibold text-ink-soft",
									children: upcoming ? `${upcoming.unit.title} · ${upcoming.lesson.exercises.length} exercises · about ${minutesFor(upcoming.lesson.exercises.length)} min` : "You have finished every sample lesson on this device."
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/lesson/$lessonId",
							params: { lessonId: upcoming?.lesson.id ?? "hello" },
							className: "press grid min-h-14 shrink-0 place-items-center rounded-2xl bg-sea px-6 text-lg font-extrabold text-foam md:min-w-52",
							children: doneCount === 0 ? "Start lesson" : upcoming ? "Continue" : "Practise again"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "panel flex items-center gap-3 p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ring, {
							value: today,
							max: dailyGoal
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-extrabold tracking-widest text-ink-soft uppercase",
								children: "Today"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-display text-2xl font-semibold tabular-nums",
								children: [today, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-base text-ink-soft",
									children: ["/", dailyGoal]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-semibold text-ink-soft",
								children: "XP towards the daily goal"
							})
						] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "panel p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-extrabold tracking-widest text-ink-soft uppercase",
								children: "Streak"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-display text-2xl font-semibold tabular-nums",
								children: [
									days,
									" ",
									days === 1 ? "day" : "days"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-semibold text-ink-soft",
								children: days === 0 ? "Finish a lesson to start one." : "Come back tomorrow to keep it."
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "panel p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs font-extrabold tracking-widest text-ink-soft uppercase",
								children: ["Level ", level.index + 1]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-2xl font-semibold",
								children: level.level.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-semibold text-ink-soft",
								children: level.level.gloss
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3 h-2 overflow-hidden rounded-full bg-sand-deep",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-full rounded-full bg-sea",
									style: { width: `${Math.round(level.into * 100)}%` }
								})
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex items-end justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-3xl font-semibold",
					children: "The path"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm font-semibold text-ink-soft",
					children: [
						doneCount,
						" of ",
						total,
						" lessons finished on this device"
					]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/learn",
					className: "text-sm font-extrabold text-sea",
					children: "Open the path"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-5",
				children: units.map((unit, index) => {
					const finished = unit.lessons.filter((lesson) => completed[lesson.id]).length;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/learn",
						hash: unit.id,
						className: "panel flex flex-col gap-2 p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs font-extrabold tracking-widest text-sea uppercase",
								children: ["Unit ", index + 1]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-xl font-semibold leading-tight",
								children: unit.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-auto text-sm font-bold text-ink-soft tabular-nums",
								children: [
									finished,
									"/",
									unit.lessons.length
								]
							})
						]
					}, unit.id);
				})
			})] })
		]
	});
}
function Ring({ value, max }) {
	const radius = 28;
	const circ = 2 * Math.PI * radius;
	const progress = Math.min(1, max === 0 ? 0 : value / max);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 72 72",
		className: "h-20 w-20 shrink-0",
		"aria-hidden": "true",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
			cx: "36",
			cy: "36",
			r: radius,
			fill: "none",
			stroke: "var(--color-sand-deep)",
			strokeWidth: "8"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
			cx: "36",
			cy: "36",
			r: radius,
			fill: "none",
			stroke: "var(--color-sea)",
			strokeWidth: "8",
			strokeLinecap: "round",
			strokeDasharray: `${circ * progress} ${circ}`,
			transform: "rotate(-90 36 36)"
		})]
	});
}
//#endregion
export { HomePage as component };
