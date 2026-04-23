const wordData = {
  beginner: [
    "activity","always","answer","between","book","bored","bottle","boy","break",
    "children","close","computer","country","face","father","feel","finger",
    "flower","friend","gate","help","look","make","monday","movie","nature","near",
    "night","notebook","often","pencil","people","play","please","potato","rich",
    "school","shoes","small","speak","spoon","sport","strong","teacher","think",
    "tree","wash","water"
  ],

  intermediate: [
    "accurate","adventure","balance","calendar","career","challenge","complete",
    "control","curious","decide","discover","energy","famous","focus","gather",
    "honest","imagine","improve","journey","knowledge","language","member",
    "message","notice","observe","outside","package","patient","perfect",
    "popular","practice","prepare","present","protect","provide","quickly",
    "reason","respect","result","secret","serious","special","student","talent",
    "travel","useful","vacation","welcome","yesterday"
  ],

  senior: [
    "ambiguous","anxious","apprehensive","articulate","assertive","assimilate",
    "astonishing","autonomous","benevolent","brevity","camouflage","capricious",
    "coherence","colloquial","conscientious","controversial","convoluted",
    "dilemma","discrepancy","divulge","eloquent","empirical","encounter",
    "enigmatic","ephemeral","fairness","filmmaker","foster","hypothetical",
    "impeccable","importune","indispensable","ineffable","judgemental",
    "meticulous","neighborhood","obsolete","paradox","perseverance","plausible",
    "pragmatic","predicament","redundant","reiterate","resilient",
    "sophisticated","spontaneous","subtle","taxonomy","unnecessary","wisdom"
  ],

  master: [
    "acknowledgment","acquaintance","architecture","biochemistry","camouflage",
    "compliance","conscientious","controversial","dehydration","disappearance",
    "embarrassing","environmentally","exaggeration","flabbergasted",
    "handkerchief","hypothetical","independence","irreplaceable",
    "knowledgeable","misunderstood","overwhelming","psychologist","quarantine",
    "recommendable","unbelievable"
  ]
};

const listBtn = document.getElementById("listBtn");
const listContainer = document.getElementById("listContainer");

const themeBtn = document.getElementById("themeBtn");

themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  if (document.body.classList.contains("dark")) {
    themeBtn.textContent = "☀️ Light";
  } else {
    themeBtn.textContent = "🌙 Dark";
  }
});

let activeLevels = {
  beginner: true,
  intermediate: true,
  senior: true,
  master: true
};

let hiddenWords = [];

let currentWord = "";
let combo = 0;
let maxCombo = 0;
let mistakes = [];

const input = document.getElementById("input");
const comboText = document.getElementById("combo");
const mistakesText = document.getElementById("mistakes");
const playBtn = document.getElementById("playBtn");

const correctSound = new Audio("audio/correct.mp3");
const wrongSound = new Audio("audio/wrong.mp3");

// 🔊 SAFE sound play
function playSound(sound) {
  const s = sound.cloneNode(); // avoids overlap issues
  s.play().catch(() => {});
}

// 🔓 unlock audio on first click
document.addEventListener("click", () => {
  playSound(correctSound);
  playSound(wrongSound);
}, { once: true });

document.querySelectorAll("#listContainer input[type=checkbox]").forEach(cb => {
  cb.addEventListener("change", () => {
    const level = cb.dataset.level;
    activeLevels[level] = cb.checked;

    console.log("Updated levels:", activeLevels); // debug
  });
});

// 🎲 pick random word
function getRandomWord() {
  let pool = [];

  for (let level in wordData) {
    if (activeLevels[level]) {
      pool = pool.concat(
        wordData[level].filter(w => !hiddenWords.includes(w))
      );
    }
  }

  if (pool.length === 0) {
    alert("No words selected!");
    return "book";
  }

  return pool[Math.floor(Math.random() * pool.length)];
}

// 🔊 play word audio
function playWord(word) {
  const audio = new Audio(`audio/${word}.mp3`);
  audio.play().catch(() => {});
}

// ▶️ next round
function nextWord() {
  currentWord = getRandomWord();
  playWord(currentWord);
}

// ✅ normalize input
function normalize(text) {
  return text.trim().toLowerCase();
}

// 🔥 update UI
function updateUI() {
  comboText.textContent = `Score x${combo}`;

  if (mistakes.length === 0) {
    mistakesText.innerHTML = "Mistakes: none";
    return;
  }

  const formatted = mistakes.map(m => `
    <span class="wrong">${m.user}</span>
    →
    <span class="correct">${m.correct}</span>
  `).join(" | ");

  mistakesText.innerHTML = "Mistakes: " + formatted;
}

// ⌨️ check answer
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const userAnswer = normalize(input.value);
    const correct = normalize(currentWord);

    if (userAnswer === correct) {
      combo++;
      if (combo > maxCombo) maxCombo = combo;

      playSound(correctSound);

    } else {
      combo = 0;

      playSound(wrongSound);

      const alreadyExists = mistakes.some(m => m.correct === currentWord);

      if (!alreadyExists) {
        mistakes.push({
          correct: currentWord,
          user: userAnswer
        });
      }
    }

	input.value = "";
	updateUI();

	// wait before next word
	setTimeout(() => {
	  nextWord();
	}, 500); // 500 ms = 0.4 seconds
	  }
	});

// 🔁 replay button (ONLY ONCE, outside!)
playBtn.addEventListener("click", () => {
  playWord(currentWord);
});

// 🚀 start game
nextWord();
updateUI();
