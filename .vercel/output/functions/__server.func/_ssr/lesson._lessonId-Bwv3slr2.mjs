import { i as __toESM } from "../_runtime.mjs";
import { C as require_jsx_runtime, Y as require_react, b as Link, x as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { d as useProgress, n as kindLabel, r as lessonAfter, t as findLesson } from "./curriculum-DrPjxvcR.mjs";
import { g as Check, l as RotateCcw, n as Volume2, o as Star, t as X } from "../_libs/lucide-react.mjs";
import { n as Route$1, r as cn } from "./router-DCJi30Qc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/lesson._lessonId-Bwv3slr2.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function normalize(input) {
	return input.trim().toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "").replace(/[’‘ʼ]/g, "'").replace(/[-‐‑–—]/g, "").replace(/[^a-z0-9' ]+/g, " ").replace(/\s+/g, " ").trim();
}
function accepted(input, answers) {
	const n = normalize(input);
	return n.length > 0 && answers.some((answer) => normalize(answer) === n);
}
function seededOrder(length, seed) {
	const idx = Array.from({ length }, (_, i) => i);
	let h = 2166136261;
	for (let i = 0; i < seed.length; i++) {
		h ^= seed.charCodeAt(i);
		h = Math.imul(h, 16777619);
	}
	for (let i = length - 1; i > 0; i--) {
		h ^= h << 13;
		h = Math.imul(h, 16777619);
		const j = (h >>> 0) % (i + 1);
		const tmp = idx[i];
		idx[i] = idx[j];
		idx[j] = tmp;
	}
	return idx;
}
function canSpeak() {
	return typeof window !== "undefined" && "speechSynthesis" in window;
}
function stopSpeech() {
	if (typeof window === "undefined" || !window.speechSynthesis) return;
	window.speechSynthesis.cancel();
}
function speak(text, onend) {
	if (!canSpeak()) return false;
	const synth = window.speechSynthesis;
	synth.cancel();
	const utterance = new SpeechSynthesisUtterance(text);
	const voice = synth.getVoices().find((item) => item.lang.toLowerCase().startsWith("fr"));
	if (voice) utterance.voice = voice;
	utterance.lang = "fr-FR";
	utterance.rate = .82;
	utterance.onend = () => onend?.();
	utterance.onerror = () => onend?.();
	synth.speak(utterance);
	return true;
}
function xpFor(grade) {
	if (grade === "first") return 10;
	if (grade === "second") return 6;
	return 2;
}
function answerText(exercise) {
	if (exercise.kind === "choice" || exercise.kind === "tap" || exercise.kind === "listen") return exercise.options[exercise.answer] ?? "";
	if (exercise.kind === "type" || exercise.kind === "blank") return exercise.reveal;
	if (exercise.kind === "build") return exercise.answer.join(" ");
	return "";
}
function LessonPlayer({ lessonId }) {
	const found = findLesson(lessonId);
	if (!found) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "lesson-shell grid place-items-center bg-sand px-6 text-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-3xl font-semibold",
			children: "Lesson not found"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/learn",
			className: "mt-4 inline-flex font-bold text-sea",
			children: "Back to the path"
		})] })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Player, {
		unitTitle: found.unit.title,
		lesson: found.lesson
	});
}
function Player({ unitTitle, lesson }) {
	const navigate = useNavigate();
	const recordLesson = useProgress((state) => state.recordLesson);
	const [index, setIndex] = (0, import_react.useState)(0);
	const [results, setResults] = (0, import_react.useState)([]);
	const [done, setDone] = (0, import_react.useState)(null);
	const [leaveOpen, setLeaveOpen] = (0, import_react.useState)(false);
	const exercise = lesson.exercises[index];
	const running = results.reduce((sum, grade) => sum + xpFor(grade), 0);
	function finish(grades) {
		const xp = grades.reduce((sum, grade) => sum + xpFor(grade), 0);
		const firsts = grades.filter((grade) => grade === "first").length;
		const score = grades.reduce((sum, grade) => sum + (grade === "first" ? 1 : grade === "second" ? .7 : .3), 0);
		const ratio = grades.length ? score / grades.length : 0;
		const stars = ratio >= .9 ? 3 : ratio >= .65 ? 2 : 1;
		const summary = recordLesson(lesson.id, {
			xp,
			stars,
			ratio
		});
		setDone({
			xp,
			stars,
			firsts,
			total: grades.length,
			gain: summary.gain,
			streak: summary.streak,
			leveledUp: summary.leveledUp,
			levelName: summary.levelName,
			levelGloss: summary.levelGloss
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
		if (done || results.length === 0 && index === 0) {
			navigate({ to: "/learn" });
			return;
		}
		setLeaveOpen(true);
	}
	const next = lessonAfter(lesson.id);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "lesson-shell flex flex-col bg-sand text-ink",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "shrink-0 border-b border-line bg-foam px-3 py-3 md:px-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex w-full max-w-xl items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: requestLeave,
							className: "press grid h-11 w-11 shrink-0 place-items-center rounded-full text-ink",
							"aria-label": "Leave lesson",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate text-xs font-bold tracking-wide text-ink-soft uppercase",
								children: unitTitle
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate text-sm font-extrabold",
								children: lesson.title
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm font-extrabold text-gold tabular-nums",
							children: [running, " XP"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: restart,
							className: "press grid h-11 w-11 shrink-0 place-items-center rounded-full text-ink-soft",
							"aria-label": "Restart lesson",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-5 w-5" })
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto mt-3 flex w-full max-w-xl gap-1",
					role: "progressbar",
					"aria-valuemin": 1,
					"aria-valuemax": lesson.exercises.length,
					"aria-valuenow": done ? lesson.exercises.length : index + 1,
					"aria-label": "Lesson progress",
					children: lesson.exercises.map((item, itemIndex) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("h-2 flex-1 rounded-full transition-colors duration-200", done || itemIndex < index ? "bg-sea" : itemIndex === index ? "bg-gold" : "bg-sand-deep") }, item.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex min-h-0 flex-1 flex-col",
				children: done ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "min-h-0 flex-1 overflow-y-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Complete, {
						done,
						lessonTitle: lesson.title,
						next,
						onRestart: restart
					})
				}) : exercise ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExerciseCard, {
					exercise,
					showNote: index === 0 && Boolean(lesson.note),
					note: lesson.note,
					onSolved: (grade) => setResults((current) => [...current, grade]),
					onContinue: goNext
				}, exercise.id) : null
			}),
			leaveOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 grid place-items-center bg-ink/40 px-4",
				role: "dialog",
				"aria-modal": "true",
				"aria-labelledby": "leave-title",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "panel w-full max-w-sm p-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							id: "leave-title",
							className: "font-display text-3xl font-semibold",
							children: "Leave this lesson?"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-ink-soft",
							children: "This try will not be saved. You can start the lesson again any time."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5 flex flex-col gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "press min-h-12 rounded-2xl bg-sea text-base font-extrabold text-foam",
								onClick: () => setLeaveOpen(false),
								children: "Keep going"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/learn",
								className: "press grid min-h-12 place-items-center rounded-2xl text-base font-bold text-ink-soft",
								children: "Leave lesson"
							})]
						})
					]
				})
			}) : null
		]
	});
}
function Complete({ done, lessonTitle, next, onRestart }) {
	const headline = done.stars === 3 ? "Maunifik" : done.stars === 2 ? "Bian fait" : "You did it";
	const line = done.stars === 3 ? "That was a sharp lesson." : done.stars === 2 ? "Another short practice and it will stick." : "You finished the lesson. That is how the language grows.";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex w-full max-w-xl flex-col items-center px-5 py-8 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-extrabold tracking-widest text-sea uppercase",
				children: "Lesson complete"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-5xl font-semibold",
				children: headline
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 max-w-sm text-ink-soft",
				children: line
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm font-bold text-ink-soft",
				children: lessonTitle
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 flex gap-1",
				"aria-label": `${done.stars} of 3 stars`,
				children: [
					0,
					1,
					2
				].map((star) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, {
					className: cn("h-8 w-8", star < done.stars ? "fill-gold text-gold" : "text-sand-deep"),
					"aria-hidden": "true"
				}, star))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid w-full grid-cols-3 gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "XP added",
						value: String(done.gain)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "First try",
						value: `${done.firsts}/${done.total}`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Streak",
						value: `${done.streak}`
					})
				]
			}),
			done.leveledUp ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 rounded-2xl bg-gold-soft px-4 py-3 text-sm font-bold text-ink",
				children: [
					"New level · ",
					done.levelName,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mt-1 block font-semibold text-ink-soft",
						children: done.levelGloss
					})
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 flex w-full flex-col gap-2",
				children: [
					next ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/lesson/$lessonId",
						params: { lessonId: next.lesson.id },
						className: "press grid min-h-14 place-items-center rounded-2xl bg-sea px-4 text-lg font-extrabold text-foam",
						children: ["Next: ", next.lesson.title]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/learn",
						className: "press grid min-h-14 place-items-center rounded-2xl bg-sea px-4 text-lg font-extrabold text-foam",
						children: "Back to the path"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onRestart,
						className: "press min-h-12 rounded-2xl border-2 border-sea text-base font-extrabold text-sea",
						children: "Practise again"
					}),
					next ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/learn",
						className: "press grid min-h-12 place-items-center rounded-2xl text-base font-bold text-ink-soft",
						children: "Back to the path"
					}) : null
				]
			})
		]
	});
}
function Stat({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl bg-foam px-2 py-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-display text-2xl font-semibold tabular-nums",
			children: value
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs font-bold text-ink-soft",
			children: label
		})]
	});
}
function ExerciseCard({ exercise, showNote, note, onSolved, onContinue }) {
	const [phase, setPhase] = (0, import_react.useState)("answer");
	const [tries, setTries] = (0, import_react.useState)(0);
	const [picked, setPicked] = (0, import_react.useState)(null);
	const [struck, setStruck] = (0, import_react.useState)(null);
	const [typed, setTyped] = (0, import_react.useState)("");
	const [builtIdx, setBuiltIdx] = (0, import_react.useState)([]);
	const [heard, setHeard] = (0, import_react.useState)(false);
	const [showWords, setShowWords] = (0, import_react.useState)(false);
	const [speaking, setSpeaking] = (0, import_react.useState)(false);
	const [shake, setShake] = (0, import_react.useState)(false);
	const [selLeft, setSelLeft] = (0, import_react.useState)(null);
	const [badRight, setBadRight] = (0, import_react.useState)(null);
	const [matched, setMatched] = (0, import_react.useState)([]);
	const [matchMistakes, setMatchMistakes] = (0, import_react.useState)(0);
	const [lockedGrade, setLockedGrade] = (0, import_react.useState)(null);
	const reported = (0, import_react.useRef)(false);
	const pool = (0, import_react.useMemo)(() => {
		if (exercise.kind !== "build") return [];
		const items = [...exercise.answer.map((word) => ({ word })), ...exercise.extra.map((word) => ({ word }))];
		return seededOrder(items.length, exercise.id).map((item) => items[item]);
	}, [exercise]);
	const rightOrder = (0, import_react.useMemo)(() => {
		if (exercise.kind !== "match") return [];
		return seededOrder(exercise.pairs.length, exercise.id);
	}, [exercise]);
	(0, import_react.useEffect)(() => () => stopSpeech(), []);
	function play(text) {
		if (!speak(text, () => setSpeaking(false))) {
			setShowWords(true);
			setHeard(true);
			setSpeaking(false);
			return;
		}
		setSpeaking(true);
		setHeard(true);
	}
	function lock(grade) {
		if (!reported.current) {
			reported.current = true;
			onSolved(grade);
		}
		setLockedGrade(grade);
		setPhase(grade === "miss" ? "revealed" : "correct");
	}
	function finishAttempt(ok) {
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
	function pickRight(pairIndex) {
		if (exercise.kind !== "match" || phase !== "answer") return;
		if (matched.includes(pairIndex) || selLeft === null) return;
		if (selLeft === pairIndex) {
			const nextMatched = [...matched, pairIndex];
			setMatched(nextMatched);
			setSelLeft(null);
			setBadRight(null);
			if (nextMatched.length === exercise.pairs.length) lock(matchMistakes > 0 ? "second" : "first");
		} else {
			setMatchMistakes((count) => count + 1);
			setBadRight(pairIndex);
			setSelLeft(null);
		}
	}
	const locked = phase === "correct" || phase === "revealed";
	const needsListen = exercise.kind === "listen" && !heard;
	const checkDisabled = !locked && (needsListen || (exercise.kind === "choice" || exercise.kind === "tap" || exercise.kind === "listen") && picked === null || (exercise.kind === "type" || exercise.kind === "blank") && typed.trim() === "" || exercise.kind === "build" && builtIdx.length === 0);
	const tone = phase === "correct" ? "bg-sea-soft" : phase === "retry" ? "bg-coral-soft" : "bg-gold-soft";
	const title = phase === "retry" ? "Not quite" : lockedGrade === "second" ? "You got it" : phase === "revealed" ? "Here's the answer" : "That's right";
	const say = "say" in exercise ? exercise.say : void 0;
	const phonetic = "phonetic" in exercise ? exercise.phonetic : void 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full min-h-0 flex-1 flex-col",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "rise min-h-0 flex-1 overflow-y-auto",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex w-full max-w-xl flex-col gap-4 px-4 py-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-extrabold tracking-widest text-sea uppercase",
						children: kindLabel(exercise.kind)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-3xl leading-tight font-semibold md:text-4xl",
						children: exercise.prompt
					}),
					showNote && note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "rounded-2xl bg-gold-soft px-3 py-2 text-sm font-semibold text-ink",
						children: note
					}) : null,
					exercise.kind === "listen" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListenPrompt, {
						say: exercise.say,
						speaking,
						showWords,
						onPlay: () => play(exercise.say),
						onShow: () => {
							setShowWords(true);
							setHeard(true);
						}
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: cn(shake && "shake"),
						onAnimationEnd: () => setShake(false),
						children: [
							exercise.kind === "choice" || exercise.kind === "listen" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid gap-2",
								children: exercise.options.map((option, optionIndex) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectButton, {
									label: option,
									layout: "row",
									selected: picked === optionIndex,
									correct: locked && optionIndex === exercise.answer,
									wrong: struck === optionIndex || locked && picked === optionIndex && optionIndex !== exercise.answer,
									disabled: locked || struck === optionIndex,
									onClick: () => setPicked(optionIndex)
								}, option))
							}) : null,
							exercise.kind === "tap" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap gap-2",
								children: exercise.options.map((option, optionIndex) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectButton, {
									label: option,
									layout: "chip",
									selected: picked === optionIndex,
									correct: locked && optionIndex === exercise.answer,
									wrong: struck === optionIndex || locked && picked === optionIndex && optionIndex !== exercise.answer,
									disabled: locked || struck === optionIndex,
									onClick: () => setPicked(optionIndex)
								}, option))
							}) : null,
							exercise.kind === "match" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MatchBoard, {
								exercise,
								rightOrder,
								matched,
								locked,
								selLeft,
								badRight,
								onLeft: (pairIndex) => setSelLeft(pairIndex),
								onRight: pickRight
							}) : null,
							exercise.kind === "type" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								onSubmit: (event) => {
									event.preventDefault();
									onCheck();
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-sm font-bold text-ink-soft",
									htmlFor: "answer",
									children: "Guernesiais"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									id: "answer",
									value: typed,
									readOnly: locked,
									onChange: (event) => setTyped(event.target.value),
									autoCapitalize: "off",
									autoCorrect: "off",
									autoComplete: "off",
									spellCheck: false,
									enterKeyHint: "done",
									placeholder: "Type here",
									className: "mt-2 min-h-14 w-full rounded-2xl border-2 border-line bg-foam px-4 text-lg font-bold outline-none focus:border-sea"
								})]
							}) : null,
							exercise.kind === "blank" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								onSubmit: (event) => {
									event.preventDefault();
									onCheck();
								},
								className: "flex flex-wrap items-center gap-2 text-xl font-bold",
								children: [
									exercise.before ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: exercise.before }) : null,
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "sr-only",
										htmlFor: "gap",
										children: "Missing word"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										id: "gap",
										value: typed,
										readOnly: locked,
										onChange: (event) => setTyped(event.target.value),
										autoCapitalize: "off",
										autoCorrect: "off",
										autoComplete: "off",
										spellCheck: false,
										enterKeyHint: "done",
										className: "min-h-14 min-w-32 flex-1 rounded-2xl border-2 border-line bg-foam px-3 text-center text-lg font-bold outline-none focus:border-sea"
									}),
									exercise.after ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: exercise.after }) : null
								]
							}) : null,
							exercise.kind === "build" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BuildBoard, {
								pool,
								builtIdx,
								locked,
								onAdd: (poolIndex) => setBuiltIdx((current) => [...current, poolIndex]),
								onRemove: (builtIndex) => setBuiltIdx((current) => current.filter((_, i) => i !== builtIndex))
							}) : null
						]
					})
				]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "shrink-0 border-t border-line bg-foam px-4 py-3",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex w-full max-w-xl flex-col gap-3",
				children: [phase !== "answer" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					role: "status",
					className: cn("rounded-2xl px-4 py-3", tone),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-extrabold",
								children: title
							}), lockedGrade ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-extrabold text-gold tabular-nums",
								children: [
									"+",
									xpFor(lockedGrade),
									" XP"
								]
							}) : null]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm font-semibold text-ink",
							children: phase === "retry" ? "Have another go." : phase === "revealed" ? `Answer: ${answerText(exercise)}. ${exercise.explain}` : exercise.explain
						}),
						locked && phonetic ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-sm font-bold text-ink-soft",
							children: [
								"Sounds like “",
								phonetic,
								"”."
							]
						}) : null,
						locked && say ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => play(say),
							className: "mt-2 inline-flex min-h-11 items-center gap-2 text-sm font-extrabold text-sea",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, {
									className: "h-4 w-4",
									"aria-hidden": "true"
								}),
								"Hear it",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold text-ink-soft",
									children: "Practice voice"
								})
							]
						}) : null
					]
				}) : null, exercise.kind === "match" && phase === "answer" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "py-3 text-center text-sm font-bold text-ink-soft",
					children: "Match every pair to continue"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: onCheck,
					disabled: checkDisabled,
					className: "press min-h-14 rounded-2xl bg-sea text-lg font-extrabold text-foam disabled:bg-sand-deep disabled:text-ink-soft",
					children: locked ? "Continue" : "Check"
				})]
			})
		})]
	});
}
function ListenPrompt({ say, speaking, showWords, onPlay, onShow }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center gap-3 py-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: onPlay,
				className: cn("press grid h-24 w-24 place-items-center rounded-full bg-sea text-foam", speaking && "speaking"),
				"aria-label": "Play the phrase with a practice voice. Not a native recording.",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "h-10 w-10" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-center text-sm font-semibold text-ink-soft",
				children: "Practice voice · not a native Guernesiais recording"
			}),
			showWords ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display text-3xl font-semibold",
				children: say
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "min-h-11 text-sm font-extrabold text-sea",
				onClick: onShow,
				children: "Show the words"
			})
		]
	});
}
function MatchBoard({ exercise, rightOrder, matched, locked, selLeft, badRight, onLeft, onRight }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mb-3 text-sm font-semibold text-ink-soft",
		children: "Tap a phrase on the left, then its match on the right."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid grid-cols-2 gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-extrabold tracking-wide text-ink-soft uppercase",
				children: "English"
			}), exercise.pairs.map((pair, pairIndex) => {
				const donePair = matched.includes(pairIndex);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					disabled: donePair || locked,
					onClick: () => onLeft(pairIndex),
					className: cn("press min-h-14 rounded-2xl border-2 px-3 py-2 text-left text-sm font-bold", donePair ? "border-sea bg-sea-soft text-sea-deep" : selLeft === pairIndex ? "border-sea bg-sea text-foam" : "border-line bg-foam"),
					children: pair.left
				}, pair.left);
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-extrabold tracking-wide text-ink-soft uppercase",
				children: "Guernesiais"
			}), rightOrder.map((pairIndex) => {
				const pair = exercise.pairs[pairIndex];
				if (!pair) return null;
				const donePair = matched.includes(pairIndex);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					disabled: donePair || locked,
					onClick: () => onRight(pairIndex),
					className: cn("press min-h-14 rounded-2xl border-2 px-3 py-2 text-left text-sm font-bold", donePair ? "border-sea bg-sea-soft text-sea-deep" : badRight === pairIndex ? "border-coral bg-coral-soft" : "border-line bg-foam"),
					children: pair.right
				}, pair.right);
			})]
		})]
	})] });
}
function BuildBoard({ pool, builtIdx, locked, onAdd, onRemove }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex min-h-20 flex-wrap gap-2 rounded-2xl border-2 border-dashed border-line bg-foam p-3",
			children: builtIdx.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm font-semibold text-ink-soft",
				children: "Tap the words below"
			}) : builtIdx.map((poolIndex, builtIndex) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				disabled: locked,
				onClick: () => onRemove(builtIndex),
				className: "press min-h-11 rounded-xl bg-sea px-3 text-base font-extrabold text-foam",
				children: pool[poolIndex]?.word
			}, `${poolIndex}-${builtIndex}`))
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-wrap gap-2",
			children: pool.map((item, poolIndex) => {
				const used = builtIdx.includes(poolIndex);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					disabled: used || locked,
					onClick: () => onAdd(poolIndex),
					className: cn("press min-h-12 rounded-full border-2 px-4 text-base font-extrabold", used ? "border-transparent bg-sand-deep text-ink-soft" : "border-line bg-foam"),
					children: item.word
				}, `${item.word}-${poolIndex}`);
			})
		})]
	});
}
function SelectButton({ label, layout, selected, correct, wrong, disabled, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		disabled,
		onClick,
		className: cn("press border-2 text-left font-bold", layout === "row" ? "flex min-h-14 w-full items-center gap-3 rounded-2xl px-4 py-3 text-base" : "min-h-12 rounded-full px-4 text-base", correct ? "border-sea bg-sea-soft text-sea-deep" : wrong ? "border-coral bg-coral-soft text-coral" : selected ? "border-sea bg-sea text-foam" : "border-line bg-foam text-ink"),
		children: [layout === "row" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: cn("grid h-7 w-7 shrink-0 place-items-center rounded-full border-2", correct || selected ? "border-current" : "border-line"),
			"aria-hidden": "true",
			children: correct ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }) : null
		}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "safe-wrap",
			children: label
		})]
	});
}
function LessonRoute() {
	const { lessonId } = Route$1.useParams();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LessonPlayer, { lessonId }, lessonId);
}
//#endregion
export { LessonRoute as component };
