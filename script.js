const startScreen = document.getElementById("start-screen");
const gameScreen = document.getElementById("game-screen");
const startBtn = document.getElementById("start-btn");
const wordEl = document.getElementById("word");
const scoreEl = document.getElementById("score");
const circle = document.getElementById("word-circle");
const timerEl = document.getElementById("timer");

let currentIndex = 0;
let score = 0;

// таймер
let timeLeft = 60; // секунды
let timerId = null;

// старт игры
startBtn.addEventListener("click", () => {
  startScreen.classList.remove("active");
  gameScreen.classList.add("active");
  score = 0;
  scoreEl.textContent = "Счёт: " + score;

  timeLeft = 60;
  updateTimerText();
  startTimer();

  shuffleWords();
  showWord();
});

// перемешивание слов
function shuffleWords() {
  for (let i = words.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [words[i], words[j]] = [words[j], words[i]];
  }
}

function showWord() {
  if (currentIndex >= words.length) {
    currentIndex = 0;
    shuffleWords();
  }
  wordEl.textContent = words[currentIndex];
}

// ===== таймер =====
function startTimer() {
  if (timerId) clearInterval(timerId);

  timerId = setInterval(() => {
    timeLeft--;
    updateTimerText();

    if (timeLeft <= 0) {
      clearInterval(timerId);
      timerId = null;
      endRound();
    }
  }, 1000);
}

function updateTimerText() {
  const seconds = timeLeft;
  const s = seconds < 10 ? "0" + seconds : seconds;
  timerEl.textContent = "00:" + s;
}

function endRound() {
  // по окончании минуты просто блокируем свайпы и пишем, что время вышло
  wordEl.textContent = "Время вышло!";
}

// ===== свайпы =====
let startY = null;
const SWIPE_THRESHOLD = 60;

circle.addEventListener("touchstart", (e) => {
  const touch = e.touches[0];
  startY = touch.clientY;
});

circle.addEventListener("touchend", (e) => {
  // если время вышло — ничего не делаем
  if (!timerId) return;

  if (startY === null) return;

  const touch = e.changedTouches[0];
  const endY = touch.clientY;
  const diffY = startY - endY;

  if (diffY > SWIPE_THRESHOLD) {
    handleCorrect();
  } else if (diffY < -SWIPE_THRESHOLD) {
    handleSkip();
  }

  startY = null;
});

function handleCorrect() {
  score++;
  scoreEl.textContent = "Счёт: " + score;
  flashCircle("up");
  nextWord();
}

function handleSkip() {
  flashCircle("down");
  nextWord();
}

function nextWord() {
  currentIndex++;
  showWord();
}

// подсветка
function flashCircle(direction) {
  if (direction === "up") {
    circle.classList.add("swipe-up");
    setTimeout(() => circle.classList.remove("swipe-up"), 150);
  } else if (direction === "down") {
    circle.classList.add("swipe-down");
    setTimeout(() => circle.classList.remove("swipe-down"), 150);
  }
}
