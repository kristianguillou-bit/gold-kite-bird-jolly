import { n as create, t as persist } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/curriculum-DrPjxvcR.js
var initial = {
	xp: 0,
	streak: 0,
	lastPracticeDate: null,
	practiceDates: [],
	dailyXp: {},
	dailyGoal: 20,
	displayName: "Learner",
	completed: {}
};
var LEVELS = [
	{
		name: "Bianvnu",
		gloss: "Welcome"
	},
	{
		name: "Pas trop mal",
		gloss: "Finding your feet"
	},
	{
		name: "V'la qui vaout",
		gloss: "That's the way"
	},
	{
		name: "Bian fait",
		gloss: "Well done"
	},
	{
		name: "Maunifik",
		gloss: "Wonderful"
	}
];
var LEVEL_XP = [
	0,
	50,
	120,
	220,
	360
];
function levelIndex(xp) {
	let index = 0;
	for (let i = 0; i < LEVEL_XP.length; i++) if (xp >= LEVEL_XP[i]) index = i;
	return index;
}
function levelProgress(xp) {
	const index = levelIndex(xp);
	const start = LEVEL_XP[index];
	const end = LEVEL_XP[index + 1] ?? start + 160;
	const level = LEVELS[index];
	const span = Math.max(1, end - start);
	return {
		index,
		level,
		start,
		end,
		into: Math.min(1, (xp - start) / span),
		atTop: index === LEVELS.length - 1
	};
}
function todayKey(offset = 0) {
	const date = /* @__PURE__ */ new Date();
	date.setHours(12, 0, 0, 0);
	date.setDate(date.getDate() + offset);
	return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
function shownStreak(streak, last, ready) {
	if (!ready || !last) return 0;
	if (last === todayKey(0) || last === todayKey(-1)) return streak;
	return 0;
}
function pruneDaily(daily) {
	const keepFrom = todayKey(-21);
	const next = {};
	for (const [key, value] of Object.entries(daily)) if (key >= keepFrom) next[key] = value;
	return next;
}
var useProgress = create()(persist((set, get) => ({
	...initial,
	hydrated: false,
	setDisplayName: (name) => set({ displayName: name.replace(/[<>]/g, "").slice(0, 24) }),
	setDailyGoal: (goal) => set({ dailyGoal: goal }),
	reset: () => set({
		...initial,
		hydrated: true
	}),
	recordLesson: (lessonId, payload) => {
		const state = get();
		const prev = state.completed[lessonId];
		const first = !prev;
		const gain = first ? payload.xp : Math.max(4, Math.round(payload.xp * .35));
		const today = todayKey(0);
		const yesterday = todayKey(-1);
		let streak = state.streak;
		if (state.lastPracticeDate === today) streak = Math.max(1, state.streak);
		else if (state.lastPracticeDate === yesterday) streak = state.streak + 1;
		else streak = 1;
		const before = levelIndex(state.xp);
		const xp = state.xp + gain;
		const after = levelIndex(xp);
		const practiceDates = state.practiceDates.includes(today) ? state.practiceDates : [...state.practiceDates, today].slice(-60);
		const dailyXp = pruneDaily({
			...state.dailyXp,
			[today]: (state.dailyXp[today] ?? 0) + gain
		});
		const level = LEVELS[after];
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
					at: (/* @__PURE__ */ new Date()).toISOString()
				}
			}
		});
		return {
			gain,
			first,
			streak,
			leveledUp: after > before,
			levelName: level.name,
			levelGloss: level.gloss
		};
	}
}), {
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
		completed: state.completed
	})
}));
var KIND_LABEL = {
	choice: "Choose the right answer",
	tap: "Tap the correct word",
	listen: "Listen, then choose",
	match: "Match the pairs",
	type: "Type the answer",
	blank: "Fill in the gap",
	build: "Tap the words in order"
};
function kindLabel(kind) {
	return KIND_LABEL[kind];
}
function choice(id, prompt, options, answer, explain, extra) {
	return {
		id,
		kind: "choice",
		prompt,
		options,
		answer,
		explain,
		...extra
	};
}
function tap(id, prompt, options, answer, explain, extra) {
	return {
		id,
		kind: "tap",
		prompt,
		options,
		answer,
		explain,
		...extra
	};
}
function listen(id, say, options, answer, explain, phonetic) {
	return {
		id,
		kind: "listen",
		prompt: "What does this phrase mean?",
		say,
		options,
		answer,
		explain,
		phonetic
	};
}
function match(id, prompt, pairs, explain) {
	return {
		id,
		kind: "match",
		prompt,
		pairs,
		explain
	};
}
function type(id, prompt, accept, reveal, explain, extra) {
	return {
		id,
		kind: "type",
		prompt,
		accept,
		reveal,
		explain,
		...extra
	};
}
function blank(id, prompt, before, after, accept, reveal, explain, extra) {
	return {
		id,
		kind: "blank",
		prompt,
		before,
		after,
		accept,
		reveal,
		explain,
		...extra
	};
}
function build(id, prompt, answer, extraWords, explain, extra) {
	return {
		id,
		kind: "build",
		prompt,
		answer,
		extra: extraWords,
		explain,
		...extra
	};
}
var units = [
	{
		id: "greetings",
		title: "Greetings & basics",
		summary: "Say hello, ask how someone is, and take your leave.",
		depth: "full",
		icon: "hand",
		lessons: [
			{
				id: "hello",
				title: "Hello and goodbye",
				summary: "The first words you will hear around the island.",
				exercises: [
					choice("hello-1", "What does Warro mean?", [
						"Thank you",
						"Hi",
						"Goodbye",
						"Please"
					], 1, "Warro is a friendly hi. It rhymes with barrow.", {
						say: "Warro",
						phonetic: "WAR-oh"
					}),
					choice("hello-2", "How do you say good day?", [
						"Naon",
						"Père",
						"Banjoür",
						"Gâche"
					], 2, "Banjoür is the everyday good day. You may also see Baonjour or Banjour.", {
						say: "Banjoür",
						phonetic: "ban-zhoor"
					}),
					listen("hello-3", "À la perchoine", [
						"Good day",
						"Thank you",
						"Goodbye",
						"Yes"
					], 2, "À la perchoine means until next time. It is the usual goodbye.", "ah la per-shwan"),
					tap("hello-4", "Tap the word for thank you.", [
						"Warro",
						"Dix",
						"Merci",
						"Oui"
					], 2, "Merci is thank you. Merci bian is thank you very much.", {
						say: "Merci",
						phonetic: "mair-see"
					}),
					build("hello-5", "Tap the words to say goodbye.", [
						"À",
						"la",
						"perchoine"
					], ["Merci", "Warro"], "À la perchoine. Until next time.", {
						say: "À la perchoine",
						phonetic: "ah la per-shwan"
					})
				]
			},
			{
				id: "how",
				title: "How are you?",
				summary: "Ask after someone, and give a kind reply.",
				exercises: [
					choice("how-1", "What does “Coum tchi qu'l'affaire va?” mean?", [
						"What's your name?",
						"How are you?",
						"Good night",
						"Let's go"
					], 1, "This is the usual way to ask how things are.", {
						say: "Coum tchi qu'l'affaire va?",
						phonetic: "kom chee k'la-fair vah"
					}),
					choice("how-2", "How do you say “Very well, thank you”?", [
						"À la perchoine",
						"Enn amas bian merci",
						"Naon",
						"I' fait fré"
					], 1, "Enn amas bian merci is a warm, polite reply.", {
						say: "Enn amas bian merci",
						phonetic: "en a-mah byan mair-see"
					}),
					match("how-3", "Match each English phrase with Guernesiais.", [
						{
							left: "How are you?",
							right: "Coum tchi qu'l'affaire va?"
						},
						{
							left: "Very well, thank you",
							right: "Enn amas bian merci"
						},
						{
							left: "Not too bad",
							right: "Pas trop mal"
						},
						{
							left: "That's the way",
							right: "V'la qui vaout"
						}
					], "V'la qui vaout is a pleased “capital!” or “that's good.”"),
					blank("how-4", "Very well, thank you.", "Enn amas bian", "", ["merci"], "merci", "Merci closes the reply: Enn amas bian merci.", {
						say: "Enn amas bian merci",
						phonetic: "mair-see"
					}),
					listen("how-5", "Pas trop mal", [
						"It's raining",
						"Not too bad",
						"Good night",
						"Please"
					], 1, "Pas trop mal is the easy answer when you are all right.", "pah troh mal")
				]
			},
			{
				id: "thanks",
				title: "Please and thank you",
				summary: "Polite words for the classroom and the table.",
				exercises: [
					choice("thanks-1", "How do you say thank you very much?", [
						"Bouanne chànce",
						"I' plleut",
						"Merci bian des feis",
						"Mon naom est"
					], 2, "Merci bian is the short form. Merci bian des feis means very much.", {
						say: "Merci bian des feis",
						phonetic: "mair-see byan day fay"
					}),
					choice("thanks-2", "Which phrase means please?", [
						"À dmoïn",
						"S'i' vous pllait",
						"Faot allaï",
						"Bouan appétit"
					], 1, "S'i' vous pllait is please, when you are speaking politely.", {
						say: "S'i' vous pllait",
						phonetic: "see voo ply-ay"
					}),
					type("thanks-3", "Type “thank you” in Guernesiais.", [
						"Merci",
						"Merci bian",
						"Mercie",
						"Mercie bian"
					], "Merci", "Merci is enough. Add bian if you want “very much”.", {
						say: "Merci bian",
						phonetic: "mair-see byan"
					}),
					build("thanks-4", "Tap the words for “thank you very much”.", [
						"Merci",
						"bian",
						"des",
						"feis"
					], ["Warro", "Naon"], "Merci bian des feis.", { say: "Merci bian des feis" }),
					tap("thanks-5", "Tap the word that starts “well done”.", [
						"Mal",
						"Fré",
						"Bian",
						"Naon"
					], 2, "Bian fait means well done. Bian on its own means well, or very.", {
						say: "Bian fait",
						phonetic: "byan feh"
					})
				]
			},
			{
				id: "names",
				title: "Yes, no and names",
				summary: "Answer simply, and say who you are.",
				exercises: [
					choice("names-1", "How do you ask “What's your name?”", [
						"Tchi qu'est vote naom?",
						"Quaïe haeure qu'il est?",
						"I' fait fré",
						"Bouan appétit"
					], 0, "Tchi qu'est vote naom? You may also hear Coume tchi qu't'as naom?", {
						say: "Tchi qu'est vote naom?",
						phonetic: "chee k'ay vote nahm"
					}),
					type("names-2", "Type “My name is” in Guernesiais.", ["Mon naom est", "Mon nom est"], "Mon naom est", "Then say your name: Mon naom est Alex.", {
						say: "Mon naom est",
						phonetic: "mon nahm ay"
					}),
					match("names-3", "Match the short replies.", [
						{
							left: "Yes",
							right: "Oui"
						},
						{
							left: "No",
							right: "Naon"
						},
						{
							left: "See you soon",
							right: "À bétao"
						},
						{
							left: "See you tomorrow",
							right: "À dmoïn"
						}
					], "Oui is yes. You may also hear Oué or Vère. Naon is no."),
					blank("names-4", "My name is…", "Mon", "est", ["naom", "nom"], "naom", "Mon naom est… Naom is name.", {
						say: "Mon naom est",
						phonetic: "nahm"
					}),
					listen("names-5", "À bétao", [
						"Goodbye for now",
						"See you soon",
						"Thank you",
						"How are you?"
					], 1, "À bétao is see you soon. À la perchoine is the fuller goodbye.", "ah bay-tow")
				]
			}
		]
	},
	{
		id: "numbers",
		title: "Numbers & colours",
		summary: "Count to ten, then name the colours around you.",
		depth: "starter",
		icon: "hash",
		lessons: [
			{
				id: "five",
				title: "One to five",
				summary: "Ieune, daeux, treis, quate, chinq.",
				exercises: [
					choice("five-1", "How do you say 3?", [
						"Dix",
						"Treis",
						"Huit",
						"Ieune"
					], 1, "Treis is three.", {
						say: "Treis",
						phonetic: "treh"
					}),
					tap("five-2", "Tap the word for 5.", [
						"Quate",
						"Daeux",
						"Chinq",
						"Six"
					], 2, "Chinq is five. You may also see chin.", {
						say: "Chinq",
						phonetic: "chank"
					}),
					match("five-3", "Match the numbers.", [
						{
							left: "1",
							right: "Ieune"
						},
						{
							left: "2",
							right: "Daeux"
						},
						{
							left: "4",
							right: "Quate"
						},
						{
							left: "5",
							right: "Chinq"
						}
					], "Ieune is one (you may also hear leune). Daeux is two. Quate is four."),
					type("five-4", "Type the Guernesiais for 2.", [
						"daeux",
						"deux",
						"deaux"
					], "daeux", "Daeux is two.", {
						say: "Daeux",
						phonetic: "deu"
					})
				]
			},
			{
				id: "ten",
				title: "Six to ten",
				summary: "Finish the first ten numbers.",
				exercises: [
					choice("ten-1", "How do you say 7?", [
						"Neuf",
						"Saept",
						"Dix",
						"Six"
					], 1, "Saept is seven.", {
						say: "Saept",
						phonetic: "saet"
					}),
					listen("ten-2", "Dix", [
						"6",
						"8",
						"2",
						"10"
					], 3, "Dix is ten.", "dees"),
					type("ten-3", "Type the Guernesiais for 8.", ["huit", "uit"], "huit", "Huit is eight, close to French.", {
						say: "Huit",
						phonetic: "weet"
					}),
					match("ten-4", "Match the numbers.", [
						{
							left: "6",
							right: "Six"
						},
						{
							left: "7",
							right: "Saept"
						},
						{
							left: "9",
							right: "Neuf"
						},
						{
							left: "10",
							right: "Dix"
						}
					], "Six, saept, neuf, dix. Neuf is nine.")
				]
			},
			{
				id: "colours",
				title: "Colours",
				summary: "Name a few colours you can see from the window.",
				note: "Colour spellings here are samples for the trial. Your teacher may prefer a parish form.",
				exercises: [
					choice("col-1", "How do you say red?", [
						"Bliu",
						"Jaune",
						"Rouoge",
						"Vèrt"
					], 2, "Rouoge is red. Sample spelling for this trial.", {
						say: "Rouoge",
						phonetic: "roozh"
					}),
					tap("col-2", "Tap the word for green.", [
						"Nièr",
						"Vèrt",
						"Blianc",
						"Rouoge"
					], 1, "Vèrt is green. Sample spelling.", {
						say: "Vèrt",
						phonetic: "vair"
					}),
					match("col-3", "Match the colours.", [
						{
							left: "Blue",
							right: "Bliu"
						},
						{
							left: "Yellow",
							right: "Jaune"
						},
						{
							left: "White",
							right: "Blianc"
						},
						{
							left: "Black",
							right: "Nièr"
						}
					], "These colour spellings are drafts, ready to swap for an approved list."),
					type("col-4", "Type the sample word for blue.", [
						"bliu",
						"bleu",
						"bleue"
					], "bliu", "Bliu is the sample spelling for blue.", {
						say: "Bliu",
						phonetic: "blyew"
					})
				]
			}
		]
	},
	{
		id: "family",
		title: "Family & people",
		summary: "The people at home, and a few kind words.",
		depth: "starter",
		icon: "users",
		lessons: [
			{
				id: "home",
				title: "At home",
				summary: "Mum, dad, and grandparents.",
				exercises: [
					choice("home-1", "How do you say mum?", [
						"Pépaen",
						"Mémaen",
						"Fille",
						"Haome"
					], 1, "Mémaen is mum. Mère is mother.", {
						say: "Mémaen",
						phonetic: "may-mahn"
					}),
					choice("home-2", "How do you say dad?", [
						"Grànpère",
						"Soeurs",
						"Pépaen",
						"Faume"
					], 2, "Pépaen is dad. Père is father. Some families say Pop.", {
						say: "Pépaen",
						phonetic: "pay-pahn"
					}),
					match("home-3", "Match the family words.", [
						{
							left: "Grandmother",
							right: "Gràndmère"
						},
						{
							left: "Grandfather",
							right: "Grànpère"
						},
						{
							left: "Family",
							right: "Faumile"
						},
						{
							left: "Mum",
							right: "Mémaen"
						}
					], "Gràndmère, Grànpère, Faumile."),
					type("home-4", "Type the word for dad.", [
						"Pépaen",
						"Pepaen",
						"Pop"
					], "Pépaen", "Pépaen is dad.", {
						say: "Pépaen",
						phonetic: "pay-pahn"
					})
				]
			},
			{
				id: "people",
				title: "The family",
				summary: "A few more people you might name.",
				exercises: [
					choice("people-1", "Which word means father?", [
						"Fille",
						"Père",
						"Faume",
						"Soeurs"
					], 1, "Père is father. Pépaen is the everyday dad.", {
						say: "Père",
						phonetic: "pair"
					}),
					tap("people-2", "Tap the word for sisters.", [
						"Soeurs",
						"Haome",
						"Mère",
						"Fille"
					], 0, "Soeurs is sisters.", {
						say: "Soeurs",
						phonetic: "surs"
					}),
					match("people-3", "Match the people.", [
						{
							left: "Mother",
							right: "Mère"
						},
						{
							left: "Girl or daughter",
							right: "Fille"
						},
						{
							left: "Husband",
							right: "Haome"
						},
						{
							left: "Wife",
							right: "Faume"
						}
					], "Mère, fille, haome, faume."),
					type("people-4", "Type the word for family.", ["Faumile", "Famille"], "Faumile", "Faumile is family.", {
						say: "Faumile",
						phonetic: "foh-meel"
					})
				]
			},
			{
				id: "kind",
				title: "Kind words",
				summary: "Welcome someone, and speak gently.",
				exercises: [
					choice("kind-1", "How do you say welcome?", [
						"Bianvnu",
						"Naon",
						"Arraête",
						"Dix"
					], 0, "Bianvnu is welcome. Bian v'nus if you are welcoming more than one person.", {
						say: "Bianvnu",
						phonetic: "byan-vnoo"
					}),
					choice("kind-2", "What does J't'oïme mean?", [
						"I'm hungry",
						"I love you",
						"See you tomorrow",
						"It's cold"
					], 1, "J't'oïme is I love you, said to one person you know well.", {
						say: "J't'oïme",
						phonetic: "zh'twem"
					}),
					listen("kind-3", "L'affaire est bian", [
						"It's raining",
						"That's quite all right",
						"Goodbye",
						"Seven"
					], 1, "L'affaire est bian means not at all, or that's quite all right.", "la-fair ay byan")
				]
			}
		]
	},
	{
		id: "food",
		title: "Food & everyday phrases",
		summary: "Tea, gâche, and the words around a meal.",
		depth: "starter",
		icon: "utensils",
		lessons: [
			{
				id: "table",
				title: "At the table",
				summary: "Please, tea, and enjoy your meal.",
				exercises: [
					choice("table-1", "How do you say a cup of tea?", [
						"Coupaïe d'tée",
						"Bouan appétit",
						"Ormé",
						"Cide"
					], 0, "Coupaïe d'tée is a cup of tea.", {
						say: "Coupaïe d'tée",
						phonetic: "koo-pye d'tay"
					}),
					choice("table-2", "What does Bouan appétit mean?", [
						"Good night",
						"Enjoy your meal",
						"It's sunny",
						"Thank you"
					], 1, "Say Bouan appétit before you eat.", {
						say: "Bouan appétit",
						phonetic: "bwan a-pay-tee"
					}),
					tap("table-3", "Tap the word for yummy.", [
						"Houmard",
						"Naon",
						"Goûtaeu",
						"Dix"
					], 2, "Goûtaeu! is yummy.", {
						say: "Goûtaeu",
						phonetic: "goo-tow"
					}),
					type("table-4", "Type “cup of tea”.", [
						"Coupaïe d'tée",
						"Coupaie d'tee",
						"Coupaie de tee"
					], "Coupaïe d'tée", "Coupaïe d'tée.", {
						say: "Coupaïe d'tée",
						phonetic: "koo-pye d'tay"
					})
				]
			},
			{
				id: "island",
				title: "Island food",
				summary: "A few foods Guernsey knows by their own names.",
				exercises: [
					choice("island-1", "What is gâche?", [
						"Lobster",
						"Cake",
						"The beach",
						"Cider"
					], 1, "Gâche is cake, especially Guernsey gâche. It sounds like gosh.", {
						say: "Gâche",
						phonetic: "gosh"
					}),
					choice("island-2", "How do you say lobster?", [
						"Ormé",
						"Toumate",
						"Houmard",
						"Cide"
					], 2, "Houmard is lobster.", {
						say: "Houmard",
						phonetic: "oo-mar"
					}),
					match("island-3", "Match the foods.", [
						{
							left: "Ormer",
							right: "Ormé"
						},
						{
							left: "Cider",
							right: "Cide"
						},
						{
							left: "Tomato",
							right: "Toumate"
						},
						{
							left: "Bean jar",
							right: "Moussaettes au four"
						}
					], "Ormé is the ormer. Moussaettes au four is bean jar."),
					listen("island-4", "Gâche", [
						"Crab",
						"Cake",
						"Beach",
						"Dad"
					], 1, "Gâche is cake.", "gosh")
				]
			},
			{
				id: "tasty",
				title: "Tastes good",
				summary: "A few more words for mealtimes.",
				exercises: [
					choice("tasty-1", "How do you say tasty?", [
						"Bouan r'lais",
						"Arraête",
						"À dmoïn",
						"Naon"
					], 0, "Bouan r'lais means tasty.", {
						say: "Bouan r'lais",
						phonetic: "bwan r'lay"
					}),
					choice("tasty-2", "What is déjunaï?", [
						"Lunchtime",
						"Breakfast time",
						"The beach",
						"Good luck"
					], 1, "Déjunaï is breakfast time. Dênaï is lunchtime. Soupaï is dinner time.", {
						say: "Déjunaï",
						phonetic: "day-zhoo-nay"
					}),
					type("tasty-3", "Type the word for yummy.", [
						"goûtaeu",
						"goutaeu",
						"gouteau"
					], "goûtaeu", "Goûtaeu!", {
						say: "Goûtaeu",
						phonetic: "goo-tow"
					}),
					listen("tasty-4", "Bouan appétit", [
						"Stop",
						"Enjoy your meal",
						"It's cold",
						"My name is"
					], 1, "Bouan appétit. Enjoy your meal.", "bwan a-pay-tee")
				]
			}
		]
	},
	{
		id: "island-life",
		title: "Weather & the island",
		summary: "Talk about the day, the beach, and a few useful signs.",
		depth: "starter",
		icon: "cloud",
		lessons: [
			{
				id: "weather",
				title: "Today's weather",
				summary: "Fine, cold, wet or sunny.",
				exercises: [
					choice("weather-1", "How do you say “It's fine today”?", [
						"I' plleut",
						"I' fait bael ogniet",
						"À la perchoine",
						"Mon naom est"
					], 1, "I' fait bael ogniet. A good Guernsey day.", {
						say: "I' fait bael ogniet",
						phonetic: "ee feh bell awn-yeh"
					}),
					choice("weather-2", "What does I' plleut mean?", [
						"It's raining",
						"It's warm",
						"Good luck",
						"Look"
					], 0, "I' plleut. It's raining.", {
						say: "I' plleut",
						phonetic: "ee pyeu"
					}),
					match("weather-3", "Match the weather.", [
						{
							left: "It's cold",
							right: "I' fait fré"
						},
						{
							left: "It's sunny",
							right: "I' fait du soleil"
						},
						{
							left: "It's warm",
							right: "I' fait caoud"
						},
						{
							left: "It's fine today",
							right: "I' fait bael ogniet"
						}
					], "Fré is cold, soleil is sun, caoud is warm."),
					listen("weather-4", "I' fait fré", [
						"It's cold",
						"It's sunny",
						"Thank you",
						"Four"
					], 0, "I' fait fré. It's cold.", "ee feh fray")
				]
			},
			{
				id: "around",
				title: "Around the island",
				summary: "Point the way, and wish someone well.",
				exercises: [
					choice("around-1", "Which phrase means “This way to the beach”?", [
						"Par ichin pour la bànque",
						"Bouanne chànce",
						"J't'oïme",
						"Coupaïe d'tée"
					], 0, "Par ichin pour la bànque. Ichìn is here. La bànque is the beach.", {
						say: "Par ichin pour la bànque",
						phonetic: "par ee-shan poor la bahnk"
					}),
					tap("around-2", "Tap the word for the beach.", [
						"Houmard",
						"Bànque",
						"Mémaen",
						"Dix"
					], 1, "La bànque is the beach.", {
						say: "La bànque",
						phonetic: "bahnk"
					}),
					type("around-3", "Type “see you tomorrow”.", [
						"À dmoïn",
						"A dmoin",
						"a dmoïn"
					], "À dmoïn", "À dmoïn. You can also say J'té verrai dmoïn, I'll see you tomorrow.", {
						say: "À dmoïn",
						phonetic: "ah dmwan"
					}),
					choice("around-4", "How do you say good luck?", [
						"Bouanne chànce",
						"I' plleut",
						"Naon",
						"Saept"
					], 0, "Bouanne chànce!", {
						say: "Bouanne chànce",
						phonetic: "bwan shahns"
					})
				]
			},
			{
				id: "signs",
				title: "Look and listen",
				summary: "Short words a teacher might call out.",
				exercises: [
					choice("signs-1", "What does Arraête! mean?", [
						"Listen",
						"Stop",
						"Eat",
						"Welcome"
					], 1, "Arraête! is stop.", {
						say: "Arraête",
						phonetic: "a-ret"
					}),
					tap("signs-2", "Tap the word for listen.", [
						"Gâche",
						"Écoute",
						"Naon",
						"Neuf"
					], 1, "Écoute! is listen.", {
						say: "Écoute",
						phonetic: "ay-koot"
					}),
					build("signs-3", "Tap the words for “Let's go!”", ["Faot", "allaï"], ["Banjoür", "Merci"], "Faot allaï! Let's go, or time to go.", {
						say: "Faot allaï",
						phonetic: "foh t'ah-lay"
					}),
					listen("signs-4", "R'garde", [
						"Look",
						"Stop",
						"Thank you",
						"Four"
					], 0, "R'garde! is look.", "r'gard")
				]
			}
		]
	}
];
function lessonCount() {
	return units.reduce((sum, unit) => sum + unit.lessons.length, 0);
}
function findLesson(id) {
	for (const unit of units) {
		const lessonIndex = unit.lessons.findIndex((lesson) => lesson.id === id);
		if (lessonIndex >= 0) return {
			unit,
			lesson: unit.lessons[lessonIndex],
			lessonIndex
		};
	}
	return null;
}
function lessonAfter(id) {
	const flat = units.flatMap((unit) => unit.lessons.map((lesson) => ({
		unit,
		lesson
	})));
	const index = flat.findIndex((item) => item.lesson.id === id);
	if (index < 0 || index === flat.length - 1) return null;
	return flat[index + 1];
}
function nextIncomplete(done) {
	for (const unit of units) for (const lesson of unit.lessons) if (!done[lesson.id]) return {
		unit,
		lesson
	};
	return null;
}
function minutesFor(count) {
	return Math.max(2, Math.round(count * .7));
}
//#endregion
export { levelProgress as a, shownStreak as c, useProgress as d, lessonCount as i, todayKey as l, kindLabel as n, minutesFor as o, lessonAfter as r, nextIncomplete as s, findLesson as t, units as u };
