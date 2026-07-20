function shuffle(items) {
  const result = [...items];

  for (let index = result.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[randomIndex]] = [result[randomIndex], result[index]];
  }

  return result;
}

export function createQuiz({
  items,
  questionCount = 10,
  optionCount = 4,
  getPrompt,
  getAnswer
}) {
  const answers = [...new Set(items.map(getAnswer))];

  if (items.length < questionCount) {
    throw new Error('Soru sayısı veri sayısından büyük olamaz.');
  }

  if (answers.length < optionCount) {
    throw new Error('Seçenekleri oluşturmak için yeterli farklı cevap yok.');
  }

  const questions = shuffle(items)
    .slice(0, questionCount)
    .map((item) => {
      const answer = getAnswer(item);
      const wrongAnswers = shuffle(answers.filter((value) => value !== answer)).slice(
        0,
        optionCount - 1
      );

      return {
        prompt: getPrompt(item),
        answer,
        options: shuffle([answer, ...wrongAnswers])
      };
    });

  let currentIndex = 0;
  let correctCount = 0;
  let currentStreak = 0;
  let answered = false;

  function getScore() {
    return correctCount * 10;
  }

  return {
    current() {
      const question = questions[currentIndex];

      return {
        ...question,
        options: [...question.options],
        number: currentIndex + 1,
        total: questions.length
      };
    },

    submit(selectedAnswer) {
      if (answered) {
        return null;
      }

      answered = true;
      const isCorrect = selectedAnswer === questions[currentIndex].answer;

      if (isCorrect) {
        correctCount += 1;
        currentStreak += 1;
      } else {
        currentStreak = 0;
      }

      return {
        isCorrect,
        correctAnswer: questions[currentIndex].answer,
        streak: currentStreak
      };
    },

    next() {
      if (!answered || currentIndex === questions.length - 1) {
        return false;
      }

      currentIndex += 1;
      answered = false;
      return true;
    },

    isLastQuestion() {
      return currentIndex === questions.length - 1;
    },

    score: getScore,

    result() {
      return {
        correct: correctCount,
        wrong: questions.length - correctCount,
        score: getScore(),
        total: questions.length
      };
    }
  };
}
