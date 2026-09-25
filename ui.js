const wordEl = document.getElementById("word");
const lettersEl = document.getElementById("letters");
const statusEl = document.getElementById("status");
const categoryEl = document.getElementById("category");
const winsEl = document.getElementById("wins");
const gamesEl = document.getElementById("games");
const mistakesEl = document.getElementById("mistakes");
const parts = document.querySelectorAll(".part");

/* Карта физических клавиш → русские буквы */
const codeToLetter = {
    KeyQ: "й", KeyW: "ц", KeyE: "у", KeyR: "к", KeyT: "е",
    KeyY: "н", KeyU: "г", KeyI: "ш", KeyO: "щ", KeyP: "з",
    KeyA: "ф", KeyS: "ы", KeyD: "в", KeyF: "а", KeyG: "п",
    KeyH: "р", KeyJ: "о", KeyK: "л", KeyL: "д",
    KeyZ: "я", KeyX: "ч", KeyC: "с", KeyV: "м", KeyB: "и",
    KeyN: "т", KeyM: "ь",
    BracketLeft: "х", BracketRight: "ъ",
    Semicolon: "ж", Quote: "э",
    Comma: "б", Period: "ю", Backquote: "ё"
};

function updateStats() {
    winsEl.textContent = wins;
    gamesEl.textContent = games;
    mistakesEl.textContent = mistakes;
}

function render() {
    // тема
    categoryEl.textContent = secretCategory ? "Тема: " + secretCategory : "";

    // слово
    wordEl.innerHTML = "";
    for (const ch of secretWord) {
        const span = document.createElement("span");
        span.className = "letter";
        span.textContent = guessed.includes(ch) ? ch : "_";
        wordEl.appendChild(span);
    }

    // виселица
    parts.forEach((p, i) => {
        if (i < mistakes) p.classList.add("visible");
    });
}

function createKeyboard() {
    alphabet.split("").forEach(letter => {
        const btn = document.createElement("button");
        btn.textContent = letter;
        btn.onclick = () => handleGuess(letter, btn);
        lettersEl.appendChild(btn);
    });
}

function handleKeyPress(event) {
    const letter = codeToLetter[event.code];
    if (!letter) return;

    const btn = [...document.querySelectorAll("#letters button")]
        .find(b => b.textContent === letter);

    if (btn && !btn.disabled) {
        btn.click();
        btn.classList.add("pressed");
        setTimeout(() => btn.classList.remove("pressed"), 100);
    }
}

/* ФУНКЦИЯ ВЗРЫВА */
function playExplosion() {
    const container = document.getElementById("explosion");
    container.innerHTML = "";

    const flash = document.createElement("div");
    flash.className = "flash";
    container.appendChild(flash);

    document.body.classList.add("shake");
    setTimeout(() => document.body.classList.remove("shake"), 500);

    const totalParticles = 60;
    for (let i = 0; i < totalParticles; i++) {
        const p = document.createElement("div");
        p.className = "particle" + (i > 40 ? " smoke" : "");

        const startX = window.innerWidth / 2;
        const startY = window.innerHeight / 2;
        p.style.left = startX + "px";
        p.style.top = startY + "px";

        const angle = Math.random() * Math.PI * 2;
        const distance = 200 + Math.random() * 400;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;
        const rot = (Math.random() * 720 - 360) + "deg";

        p.style.setProperty("--tx", tx + "px");
        p.style.setProperty("--ty", ty + "px");
        p.style.setProperty("--rot", rot);

        p.style.animationDelay = (Math.random() * 0.15) + "s";

        const size = 8 + Math.random() * 10;
        p.style.width = size + "px";
        p.style.height = size + "px";

        container.appendChild(p);
    }

    setTimeout(() => {
        container.innerHTML = "";
    }, 1500);
}

/* ФУНКЦИЯ ПОБЕДЫ */
function playVictory() {
    const container = document.getElementById("explosion");
    container.innerHTML = "";

    // золотое кольцо вокруг слова
    const ring = document.createElement("div");
    ring.className = "victory-ring";
    const wordRect = document.querySelector(".word").getBoundingClientRect();
    ring.style.left = (wordRect.left + wordRect.width / 2) + "px";
    ring.style.top = (wordRect.top + wordRect.height / 2) + "px";
    container.appendChild(ring);

    // конфетти
    const colors = [
        { bg: "#78c05a", border: "#1e4419" },
        { bg: "#fbbf24", border: "#7a4a00" },
        { bg: "#5eead4", border: "#0f766e" },
        { bg: "#a78bfa", border: "#4c1d95" },
        { bg: "#f87171", border: "#7f1d1d" }
    ];

    const totalConfetti = 80;
    for (let i = 0; i < totalConfetti; i++) {
        const c = document.createElement("div");
        c.className = "confetti";

        const startX = Math.random() * window.innerWidth;
        c.style.left = startX + "px";
        c.style.top = "-20px";

        const color = colors[Math.floor(Math.random() * colors.length)];
        c.style.background = color.bg;
        c.style.borderColor = color.border;

        const duration = 2 + Math.random() * 2;
        const delay = Math.random() * 0.8;
        const drift = (Math.random() - 0.5) * 200;
        const rot = (Math.random() * 720 - 360) + "deg";

        c.style.animationDuration = duration + "s";
        c.style.animationDelay = delay + "s";
        c.style.setProperty("--drift", drift + "px");
        c.style.setProperty("--rot", rot);

        container.appendChild(c);
    }

    // пульсация слова
    wordEl.classList.add("victory");

    setTimeout(() => {
        container.innerHTML = "";
        wordEl.classList.remove("victory");
    }, 4000);
}

document.addEventListener("keydown", handleKeyPress);
