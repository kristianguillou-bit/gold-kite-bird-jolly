import { C as require_jsx_runtime, b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { d as useProgress, o as minutesFor, s as nextIncomplete, u as units } from "./curriculum-DrPjxvcR.mjs";
import { d as Hash, f as Hand, g as Check, i as Users, m as CloudSun, o as Star, r as UtensilsCrossed } from "../_libs/lucide-react.mjs";
import { r as cn } from "./router-DCJi30Qc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/learn-C7E8QarM.js
var import_jsx_runtime = require_jsx_runtime();
var ICONS = {
	hand: Hand,
	hash: Hash,
	users: Users,
	utensils: UtensilsCrossed,
	cloud: CloudSun
};
function LearnPage() {
	const completed = useProgress((state) => state.completed);
	const upcoming = nextIncomplete(completed);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-extrabold tracking-widest text-sea uppercase",
					children: "Lesson path"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-1 font-display text-4xl font-semibold md:text-5xl",
					children: "Five units to trial"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 max-w-2xl text-ink-soft",
					children: "Every unit is open. Unit 1 is a full sample. The later units are shorter starter sets, ready to expand with approved texts."
				})
			] }),
			units.map((unit, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UnitBlock, {
				unit,
				index,
				completed,
				nextId: upcoming?.lesson.id ?? null
			}, unit.id)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-2xl text-sm font-semibold text-ink-soft",
				children: "Sample phrases are drawn from published Guernesiais word lists, including public Language Commission materials. Parish spellings differ, and this set is ready to swap."
			})
		]
	});
}
function UnitBlock({ unit, index, completed, nextId }) {
	const Icon = ICONS[unit.icon];
	const finished = unit.lessons.filter((lesson) => completed[lesson.id]).length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id: unit.id,
		className: "scroll-mt-24",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex items-start gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-sea text-foam",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
						className: "h-6 w-6",
						"aria-hidden": "true"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs font-extrabold tracking-widest text-sea uppercase",
								children: ["Unit ", index + 1]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: cn("rounded-full px-2.5 py-1 text-xs font-extrabold", unit.depth === "full" ? "bg-sea-soft text-sea-deep" : "bg-sand-deep text-ink-soft"),
								children: unit.depth === "full" ? "Full sample" : "Starter set"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-3xl font-semibold",
							children: unit.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm font-semibold text-ink-soft",
							children: [
								unit.summary,
								" ",
								finished,
								"/",
								unit.lessons.length,
								" lessons."
							]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-2 overflow-hidden rounded-full bg-sand-deep",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-full rounded-full bg-sea",
					style: { width: `${unit.lessons.length ? finished / unit.lessons.length * 100 : 0}%` }
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "mt-3 flex flex-col gap-2",
				children: unit.lessons.map((lesson, lessonIndex) => {
					const record = completed[lesson.id];
					const upNext = lesson.id === nextId;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/lesson/$lessonId",
						params: { lessonId: lesson.id },
						className: cn("flex min-h-16 items-center gap-3 rounded-2xl border-2 px-3 py-3", upNext ? "border-sea bg-sea-soft" : "border-line bg-foam"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: cn("grid h-10 w-10 shrink-0 place-items-center rounded-full text-sm font-extrabold", record ? "bg-sea text-foam" : "bg-sand-deep text-ink"),
								"aria-hidden": "true",
								children: record ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-5 w-5" }) : lessonIndex + 1
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block font-extrabold",
									children: lesson.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "block text-sm font-semibold text-ink-soft",
									children: [
										lesson.summary,
										" · ",
										minutesFor(lesson.exercises.length),
										" min",
										upNext ? " · Up next" : ""
									]
								})]
							}),
							record ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "flex shrink-0",
								"aria-label": `${record.stars} stars`,
								children: [
									0,
									1,
									2
								].map((star) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, {
									className: cn("h-4 w-4", star < record.stars ? "fill-gold text-gold" : "text-sand-deep"),
									"aria-hidden": "true"
								}, star))
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "shrink-0 text-sm font-extrabold text-sea",
								children: upNext ? "Start" : "Open"
							})
						]
					}) }, lesson.id);
				})
			})
		]
	});
}
//#endregion
export { LearnPage as component };
