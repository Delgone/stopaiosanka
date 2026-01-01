const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');

const startBtn = document.getElementById('start-btn');
const backBtn = document.getElementById('back-btn');
const backFromEndBtn = document.getElementById('back-from-end-btn');
const newRoundBtn = document.getElementById('new-round-btn');

const roundTimeInput = document.getElementById('round-time');
const timerEl = document.getElementById('timer');
const scoreEl = document.getElementById('score');
const circle = document.getElementById('word-circle');
const afterTimeBlock = document.getElementById('after-time');

let currentIndex = 0;
let score = 0;
let timerId = null;
let timeLeft = 60;
let isRoundActive = false;

// перемешивание слов
function shuffleWords(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  const mm = m < 10 ? '0' + m : '' + m;
  const ss = s < 10 ? '0' + s : '' + s;
  return mm + ':' + ss;
}

function showWord() {
  if (!words || words.length === 0) {
    circle.textContent = 'Нет слов';
    return;
  }
  if (currentIndex >= words.length) {
    currentIndex = 0;
    shuffleWords(words);
  }
  circle.textContent = words[currentIndex];
}

// старт раунда
function startRound() {
  const inputSeconds = parseInt(roundTimeInput.value, 10);
  timeLeft = isNaN(inputSeconds) ? 60 : Math.max(10, Math.min(inputSeconds, 600));
  roundTimeInput.value = timeLeft;

  startScreen.classList.remove('active');
  gameScreen.classList.add('active');

  score = 0;
  currentIndex = 0;
  shuffleWords(words);
  showWord();

  scoreEl.textContent = score;
  timerEl.textContent = formatTime(timeLeft);
  afterTimeBlock.classList.add('hidden');

  isRoundActive = true;

  if (timerId) clearInterval(timerId);
  timerId = setInterval(() => {
    timeLeft--;
    timerEl.textContent = formatTime(timeLeft);
    if (timeLeft <= 0) {
      endRound();
    }
  }, 1000);
}

function endRound() {
  isRoundActive = false;
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }
  timerEl.textContent = '00:00';
  circle.textContent = 'Время вышло!';
  circle.style.transform = 'translateY(0)';
  afterTimeBlock.classList.remove('hidden');
}

function goToStart() {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }
  isRoundActive = false;
  circle.style.transform = 'translateY(0)';
  timerEl.textContent = formatTime(parseInt(roundTimeInput.value, 10) || 60);
  startScreen.classList.add('active');
  gameScreen.classList.remove('active');
}

// свайп + движение круга за пальцем
let startY = null;
let currentTranslateY = 0;

circle.addEventListener('touchstart', (e) => {
  if (!isRoundActive) return;
  const touch = e.touches[0];
  startY = touch.clientY;
  currentTranslateY = 0;
  circle.style.transition = 'none';
});

circle.addEventListener('touchmove', (e) => {
  if (!isRoundActive || startY === null) return;
  const touch = e.touches[0];
  const diffY = touch.clientY - startY;
  currentTranslateY = diffY;

  const maxOffset = 150;
  const clamped = Math.max(-maxOffset, Math.min(maxOffset, diffY));

  circle.style.transform = `translateY(${clamped}px)`;
  e.preventDefault();
});

circle.addEventListener('touchend', () => {
  if (!isRoundActive || startY === null) return;
  const threshold = 60;
  const diffY = currentTranslateY;

  circle.style.transition = 'transform 0.15s ease-out';
  circle.style.transform = 'translateY(0)';

  if (Math.abs(diffY) < threshold) {
    startY = null;
    currentTranslateY = 0;
    return;
  }

  if (diffY < 0) {
    // вверх — отгадано
    score++;
    scoreEl.textContent = score;
  }
  // вниз — просто следующее слово

  currentIndex++;
  showWord();

  startY = null;
  currentTranslateY = 0;
});

// кнопки
startBtn.addEventListener('click', startRound);
newRoundBtn.addEventListener('click', startRound);
backBtn.addEventListener('click', goToStart);
backFromEndBtn.addEventListener('click', goToStart);
