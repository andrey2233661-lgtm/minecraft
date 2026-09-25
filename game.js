let secretWord, secretCategory, guessed, mistakes;
let wins = 0;
let games = 0;

function newGame() {
    const pick = words[Math.floor(Math.random() * words.length)];
    secretWord = pick.word;
    secretCategory = pick.category;
    guessed = [];
    mistakes = 0;
    statusEl.textContent = "";
    statusEl.className = "status";
    lettersEl.innerHTML = "";
    parts.forEach(p => p.classList.remove("visible"));
    updateStats();
    createKeyboard();
    render();
}

function checkWin() {
    return secretWord.split("").every(ch => guessed.includes(ch));
}

function handleGuess(letter, btn) {
    btn.disabled = true;
    if (secretWord.includes(letter)) {
        guessed.push(letter);
        btn.classList.add("correct");
    } else {
        mistakes++;
        btn.classList.add("wrong");
    }
    updateStats();
    render();

    if (checkWin()) {
        wins++;
        games++;
        statusEl.textContent = "🎉 Победа! Слово: " + secretWord;
        statusEl.classList.add("win");
        updateStats();
        disableAll();
        playVictory();
    } else if (mistakes >= maxMistakes) {
        games++;
        statusEl.textContent = "💀 Проигрыш. Было слово: " + secretWord;
        statusEl.classList.add("lose");
        updateStats();
        disableAll();
        playExplosion();
    }
}

function disableAll() {
    document.querySelectorAll("#letters button").forEach(b => b.disabled = true);
}