import { i as __toESM } from "../_runtime.mjs";
import { C as require_jsx_runtime, Y as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as levelProgress, c as shownStreak, d as useProgress, i as lessonCount, l as todayKey, u as units } from "./curriculum-DrPjxvcR.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/profile-D4jC_0s-.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var GOALS = [
	20,
	30,
	50
];
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
	const [confirm, setConfirm] = (0, import_react.useState)(false);
	const level = levelProgress(hydrated ? xp : 0);
	const days = shownStreak(streak, last, hydrated);
	const total = lessonCount();
	const doneCount = Object.keys(completed).length;
	const initial = (displayName.trim()[0] ?? "L").toUpperCase();
	const daysOfWeek = Array.from({ length: 7 }, (_, index) => {
		const offset = index - 6;
		const key = todayKey(offset);
		const date = /* @__PURE__ */ new Date();
		date.setDate(date.getDate() + offset);
		return {
			key,
			label: date.toLocaleDateString("en-GB", { weekday: "narrow" }),
			on: hydrated && practiceDates.includes(key),
			today: offset === 0
		};
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex max-w-3xl flex-col gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "panel flex items-center gap-4 p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "grid h-16 w-16 shrink-0 place-items-center rounded-full bg-sea font-display text-3xl font-semibold text-foam",
					children: initial
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-extrabold tracking-widest text-sea uppercase",
							children: "This device"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-display text-4xl font-semibold",
							children: "Your progress"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm font-semibold text-ink-soft",
							children: [
								"Level ",
								level.index + 1,
								" · ",
								level.level.name,
								" · ",
								level.level.gloss
							]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-3 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tile, {
						label: "Total XP",
						value: String(hydrated ? xp : 0)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tile, {
						label: "Day streak",
						value: String(days)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tile, {
						label: "Lessons",
						value: `${doneCount}/${total}`
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "panel p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl font-semibold",
						children: "This week"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-semibold text-ink-soft",
						children: "Days with at least one finished lesson on this device."
					}),
					hydrated ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
						className: "mt-4 grid grid-cols-7 gap-2",
						children: daysOfWeek.map((day) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "text-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: day.on ? "mx-auto grid h-10 w-10 place-items-center rounded-full bg-sea text-sm font-extrabold text-foam" : "mx-auto grid h-10 w-10 place-items-center rounded-full bg-sand-deep text-sm font-extrabold text-ink-soft",
								children: day.label
							}), day.today ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-1 block text-xs font-bold text-sea",
								children: "Today"
							}) : null]
						}, day.key))
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-4 h-10 rounded-full bg-sand-deep" })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "panel p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl font-semibold",
						children: "Units"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-4 text-sm font-semibold text-ink-soft",
						children: "Useful on a projector: how far this device has got through the sample path."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "flex flex-col gap-4",
						children: units.map((unit, index) => {
							const finished = unit.lessons.filter((lesson) => completed[lesson.id]).length;
							const width = unit.lessons.length ? finished / unit.lessons.length * 100 : 0;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-1 flex items-baseline justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "font-extrabold",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-ink-soft",
											children: [index + 1, "."]
										}),
										" ",
										unit.title
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-sm font-bold text-ink-soft tabular-nums",
									children: [
										finished,
										"/",
										unit.lessons.length
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-3 overflow-hidden rounded-full bg-sand-deep",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-full rounded-full bg-sea",
									style: { width: `${width}%` }
								})
							})] }, unit.id);
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "panel p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl font-semibold",
						children: "Name on this device"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "mt-3 block text-sm font-bold text-ink-soft",
						htmlFor: "learner-name",
						children: "Shown on the home screen. Nothing is sent to an account."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						id: "learner-name",
						value: displayName,
						maxLength: 24,
						onChange: (event) => setDisplayName(event.target.value),
						onBlur: () => {
							if (!displayName.trim()) setDisplayName("Learner");
							else setDisplayName(displayName.trim());
						},
						className: "mt-2 min-h-12 w-full rounded-2xl border-2 border-line bg-foam px-4 text-lg font-bold outline-none focus:border-sea"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-sm font-bold text-ink",
						children: "Daily goal"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 flex flex-wrap gap-2",
						children: GOALS.map((goal) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							"aria-pressed": dailyGoal === goal,
							onClick: () => setDailyGoal(goal),
							className: dailyGoal === goal ? "min-h-11 rounded-full bg-sea px-4 text-sm font-extrabold text-foam" : "min-h-11 rounded-full bg-sand-deep px-4 text-sm font-extrabold text-ink",
							children: [goal, " XP"]
						}, goal))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "panel p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl font-semibold",
						children: "About these lessons"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-ink-soft",
						children: "Guernesiais is the Norman language of Guernsey, also called Guernsey French or Patois. The trial uses short sample lessons so a class can try the activity. Words can be replaced with texts approved for school. There is no account in this demo: stars, XP and the streak stay in this browser."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm font-semibold text-ink-soft",
						children: "The listen button uses the device’s French voice as a placeholder. It is not a Guernesiais recording."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "px-1 pb-4",
				children: confirm ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "panel p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-2xl font-semibold",
							children: "Clear progress?"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm font-semibold text-ink-soft",
							children: "This removes XP, the streak and lesson stars on this device."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex flex-col gap-2 sm:flex-row",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "press min-h-12 flex-1 rounded-2xl bg-coral text-base font-extrabold text-foam",
								onClick: () => {
									reset();
									setConfirm(false);
								},
								children: "Clear progress"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "press min-h-12 flex-1 rounded-2xl border-2 border-line text-base font-bold",
								onClick: () => setConfirm(false),
								children: "Cancel"
							})]
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setConfirm(true),
					className: "min-h-12 text-sm font-extrabold text-coral",
					children: "Reset progress on this device"
				})
			})
		]
	});
}
function Tile({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "panel p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs font-extrabold tracking-widest text-ink-soft uppercase",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-display text-3xl font-semibold tabular-nums",
			children: value
		})]
	});
}
//#endregion
export { ProfilePage as component };
