import { createQuiz } from '../core/quiz-engine.js?v=20260716-4';
import { getMode } from '../config/modes.js?v=20260717-4';

const difficulties = {
  easy: { label: 'Kolay', optionCount: 2, timeLimit: 15 },
  medium: { label: 'Orta', optionCount: 3, timeLimit: 10 },
  hard: { label: 'Zor', optionCount: 4, timeLimit: 5 }
};

const modeId = new URLSearchParams(window.location.search).get('mode') || 'plates';
const mode = getMode(modeId);

const setupView = document.querySelector('#setup-view');
const questionView = document.querySelector('#question-view');
const resultView = document.querySelector('#result-view');
const errorView = document.querySelector('#error-view');
const views = [setupView, questionView, resultView, errorView];
const gamePanel = document.querySelector('.game-panel');

const modeTitle = document.querySelector('#mode-title');
const modeDescription = document.querySelector('#mode-description');
const questionMode = document.querySelector('#question-mode');
const questionCounter = document.querySelector('#question-counter');
const difficultyLabel = document.querySelector('#difficulty-label');
const liveScore = document.querySelector('#live-score');
const progressBar = document.querySelector('#game-progress');
const progressValue = document.querySelector('#game-progress-value');
const streakBadge = document.querySelector('#streak-badge');
const questionCard = document.querySelector('.question-card');
const questionVisual = document.querySelector('#question-visual');
const questionImage = document.querySelector('#question-image');
const questionText = document.querySelector('#question-text');
const answerList = document.querySelector('#answer-list');
const feedback = document.querySelector('#feedback');
const nextButton = document.querySelector('#next-button');
const resultMessage = document.querySelector('#result-message');
const correctResult = document.querySelector('#correct-result');
const wrongResult = document.querySelector('#wrong-result');
const scoreResult = document.querySelector('#score-result');
const difficultyButtons = [...document.querySelectorAll('[data-difficulty]')];
const selectionHint = document.querySelector('#selection-hint');
const startButton = document.querySelector('#start-button');
const questionTimer = document.querySelector('#question-timer');
const timerText = document.querySelector('#timer-text');

let quiz = null;
let selectedDifficultyId = null;
let timerId = null;
let timerEndTime = 0;
let timerDuration = 0;

function formatAnswer(answer) {
  return mode.formatAnswer?.(answer) ?? String(answer);
}

function showView(activeView) {
  views.forEach((view) => {
    view.hidden = view !== activeView;
  });

  gamePanel.dataset.view = activeView.id;
  gamePanel.scrollTop = 0;
}

function startGame(difficultyId) {
  const difficulty = difficulties[difficultyId];
  const items = mode.getItems?.(difficultyId) ?? mode.items;

  quiz = createQuiz({
    items,
    questionCount: mode.questionCount,
    optionCount: difficulty.optionCount,
    getPrompt: mode.getPrompt,
    getAnswer: mode.getAnswer
  });

  questionView.dataset.level = difficultyId;
  questionMode.textContent = mode.title;
  difficultyLabel.textContent = difficulty.label;
  liveScore.textContent = '0';
  updateStreak(0);
  showView(questionView);
  renderQuestion();
}

function selectDifficulty(difficultyId) {
  const difficulty = difficulties[difficultyId];

  selectedDifficultyId = difficultyId;
  setupView.dataset.level = difficultyId;
  selectionHint.textContent = `${difficulty.label} seviye seçildi. Hazırsan oyunu başlat.`;
  startButton.disabled = false;

  difficultyButtons.forEach((button) => {
    button.setAttribute(
      'aria-pressed',
      String(button.dataset.difficulty === selectedDifficultyId)
    );
  });
}

function resetDifficultySelection() {
  selectedDifficultyId = null;
  delete setupView.dataset.level;
  selectionHint.textContent = 'Başlamak için bir seviye seç.';
  startButton.disabled = true;

  difficultyButtons.forEach((button) => {
    button.setAttribute('aria-pressed', 'false');
  });
}

function stopTimer() {
  if (timerId) {
    window.clearInterval(timerId);
    timerId = null;
  }
}

function updateTimer() {
  const remainingTime = Math.max(0, timerEndTime - Date.now());
  const remainingSeconds = Math.ceil(remainingTime / 1000);
  const remainingPercent = (remainingTime / timerDuration) * 100;
  const isUrgent = remainingPercent <= 30;

  timerText.textContent = String(remainingSeconds);
  questionTimer.style.setProperty('--timer-progress', String(remainingPercent));
  questionTimer.classList.toggle('is-urgent', isUrgent);
  questionTimer.setAttribute('aria-label', `${remainingSeconds} saniye kaldı`);

  if (remainingTime === 0) {
    stopTimer();
    handleTimeUp();
  }
}

function startTimer(seconds) {
  stopTimer();
  timerDuration = seconds * 1000;
  timerEndTime = Date.now() + timerDuration;
  questionTimer.classList.remove('is-urgent');
  questionTimer.style.setProperty('--timer-progress', '100');
  updateTimer();
  timerId = window.setInterval(updateTimer, 100);
}

function updateStreak(streak) {
  const hasStreak = streak >= 2;

  streakBadge.hidden = !hasStreak;
  streakBadge.textContent = hasStreak ? `🔥 ${streak} doğru seri` : '';
}

function renderPrompt(prompt) {
  const content = typeof prompt === 'string' ? { text: prompt } : prompt;
  const visual = content.visual;

  questionText.textContent = content.text;
  questionCard.classList.toggle('has-visual', Boolean(visual));
  questionVisual.hidden = !visual;

  if (visual) {
    questionImage.src = visual.src;
    questionImage.alt = visual.alt ?? 'Soru görseli';
  } else {
    questionImage.removeAttribute('src');
    questionImage.alt = '';
  }
}

function renderQuestion() {
  const question = quiz.current();
  const progress = (question.number / question.total) * 100;

  questionCounter.textContent = `${question.number} / ${question.total}`;
  liveScore.textContent = String(quiz.score());
  renderPrompt(question.prompt);
  progressBar.setAttribute('aria-valuenow', String(question.number));
  progressBar.setAttribute('aria-valuemax', String(question.total));
  progressValue.style.width = `${progress}%`;
  feedback.textContent = '';
  feedback.className = 'feedback';
  nextButton.disabled = true;
  nextButton.textContent = quiz.isLastQuestion() ? 'Sonuçları Gör' : 'Sonraki Soru';
  answerList.replaceChildren();

  question.options.forEach((option, index) => {
    const button = document.createElement('button');
    const letter = document.createElement('span');
    const text = document.createElement('span');

    button.type = 'button';
    button.className = 'answer-button';
    button.dataset.answer = String(option);
    letter.className = 'answer-letter';
    letter.textContent = String.fromCharCode(65 + index);
    text.textContent = formatAnswer(option);

    button.append(letter, text);
    button.addEventListener('click', () => selectAnswer(option, button));
    answerList.append(button);
  });

  startTimer(difficulties[selectedDifficultyId].timeLimit);
}

function finishQuestion(answer, selectedButton = null, isTimeUp = false) {
  const buttons = [...answerList.querySelectorAll('.answer-button')];
  const formattedCorrectAnswer = formatAnswer(answer.correctAnswer);

  buttons.forEach((button) => {
    button.disabled = true;

    if (button.dataset.answer === String(answer.correctAnswer)) {
      button.classList.add('is-correct');
    }
  });

  if (selectedButton && !answer.isCorrect) {
    selectedButton.classList.add('is-wrong');
  }

  if (isTimeUp) {
    feedback.textContent = `Süre doldu. Doğru cevap: ${formattedCorrectAnswer}`;
    feedback.classList.add('is-wrong');
  } else if (answer.isCorrect) {
    feedback.textContent = 'Doğru cevap!';
    feedback.classList.add('is-correct');
  } else {
    feedback.textContent = `Doğru cevap: ${formattedCorrectAnswer}`;
    feedback.classList.add('is-wrong');
  }

  liveScore.textContent = String(quiz.score());
  updateStreak(answer.streak);
  nextButton.disabled = false;
}

function selectAnswer(selectedAnswer, selectedButton) {
  stopTimer();
  const answer = quiz.submit(selectedAnswer);

  if (!answer) {
    return;
  }

  finishQuestion(answer, selectedButton);
}

function handleTimeUp() {
  const answer = quiz.submit(null);

  if (!answer) {
    return;
  }

  finishQuestion(answer, null, true);
}

function showResult() {
  stopTimer();
  const result = quiz.result();

  correctResult.textContent = String(result.correct);
  wrongResult.textContent = String(result.wrong);
  scoreResult.textContent = String(result.score);

  if (result.correct >= 8) {
    resultMessage.textContent = 'Harika sonuç! Bu turda bilgini konuşturdun.';
  } else if (result.correct >= 5) {
    resultMessage.textContent = 'Güzel gidiyorsun. Bir tur daha seni ileri taşır.';
  } else {
    resultMessage.textContent = 'Her oyun yeni bir öğrenme fırsatı. Tekrar deneyebilirsin.';
  }

  showView(resultView);
}

difficultyButtons.forEach((button) => {
  button.addEventListener('click', () => selectDifficulty(button.dataset.difficulty));
});

startButton.addEventListener('click', () => {
  if (selectedDifficultyId) {
    startGame(selectedDifficultyId);
  }
});

nextButton.addEventListener('click', () => {
  if (nextButton.disabled) {
    return;
  }

  if (quiz.next()) {
    renderQuestion();
  } else {
    showResult();
  }
});

document.querySelector('#restart-button').addEventListener('click', () => {
  stopTimer();
  quiz = null;
  resetDifficultySelection();
  showView(setupView);
});

if (mode) {
  modeTitle.textContent = mode.title;
  modeDescription.textContent = mode.description;
  document.title = `${mode.title} | Biliver`;
  showView(setupView);
} else {
  showView(errorView);
}
