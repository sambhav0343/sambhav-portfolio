
// =====================================
// 1. Dark / Light Mode
// =====================================

const themeToggle = document.getElementById("theme-toggle");
const root = document.documentElement;

// Load saved theme preference
function applyTheme(theme) {
  root.setAttribute("data-theme", theme);
  themeToggle.checked = theme === "dark";
}

try {
  const savedTheme = localStorage.getItem("portfolio-theme");
  applyTheme(savedTheme === "dark" ? "dark" : "light");
} catch (error) {
  // Use light theme if storage is unavailable
  applyTheme("light");
}

// Change and save theme
themeToggle.addEventListener("change", () => {
  const theme = themeToggle.checked ? "dark" : "light";

  applyTheme(theme);

  try {
    localStorage.setItem("portfolio-theme", theme);
  } catch (error) {
    // Theme still works for the current page
  }
});


// =====================================
// 2. Quiz Setup
// =====================================

const quizForm = document.getElementById("quiz-form");
const quizQuestions = document.querySelectorAll(".quiz-question");

const quizMessage = document.getElementById("quiz-message");
const quizResult = document.getElementById("quiz-result");
const quizScore = document.getElementById("quiz-score");
const scoreBar = document.getElementById("score-bar");
const scoreMessage = document.getElementById("score-message");

const tryAgainButton = document.getElementById("try-again");

// Correct answers and their explanations
const answers = [
  {
    value: "b",
    text: ".py"
  },
  {
    value: "c",
    text: "def"
  },
  {
    value: "d",
    text: "Boolean"
  },
  {
    value: "a",
    text: "Artificial Intelligence"
  },
  {
    value: "b",
    text: "Training data"
  }
];


// =====================================
// 3. Submit Quiz
// =====================================

quizForm.addEventListener("submit", function (event) {
  event.preventDefault();

  let score = 0;
  let allAnswered = true;

  // Check whether every question is answered
  for (let i = 0; i < answers.length; i++) {
    const selected = quizForm.querySelector(
      `input[name="q${i + 1}"]:checked`
    );

    if (!selected) {
      allAnswered = false;
      break;
    }
  }

  // Stop submission if any question is unanswered
  if (!allAnswered) {
    quizMessage.textContent =
      "Please answer all 5 questions before submitting!";

    const firstUnanswered = Array.from(
      { length: answers.length },
      (_, i) => i + 1
    ).find(number => {
      return !quizForm.querySelector(
        `input[name="q${number}"]:checked`
      );
    });

    const firstQuestion = quizForm.querySelector(
      `input[name="q${firstUnanswered}"]`
    );

    if (firstQuestion) {
      firstQuestion.focus();
    }

    return;
  }

  quizMessage.textContent = "";

  // Check every answer
  quizQuestions.forEach((question, index) => {
    const questionNumber = index + 1;

    const selected = quizForm.querySelector(
      `input[name="q${questionNumber}"]:checked`
    );

    const feedback = question.querySelector(".answer-feedback");

    const isCorrect = selected.value === answers[index].value;

    // Remove previous result classes
    question.classList.remove("correct", "wrong");

    if (isCorrect) {
      score++;

      // Green highlight for correct answers
      question.classList.add("correct");

      feedback.textContent = "✓ Correct! Well done.";

    } else {
      // Red highlight for incorrect answers
      question.classList.add("wrong");

      feedback.textContent = "";

      const message = document.createElement("span");
      message.textContent = "✗ Incorrect. ";

      const correctAnswer = document.createElement("span");
      correctAnswer.className = "correct-answer";
      correctAnswer.textContent =
        "Correct answer: " + answers[index].text;

      feedback.append(message, correctAnswer);
    }

    // Disable options after submission
    question.querySelectorAll("input").forEach(input => {
      input.disabled = true;
    });
  });

  // Display score
  quizScore.textContent = `${score} / 5`;

  // Update score progress bar
  const percentage = (score / answers.length) * 100;
  scoreBar.style.width = `${percentage}%`;

  // Display a message based on the score
  if (score === 5) {
    scoreMessage.textContent =
      "Excellent! You got all 5 questions correct! 🎉";
  } else if (score >= 3) {
    scoreMessage.textContent =
      "Good job! Keep learning and improving. 👍";
  } else {
    scoreMessage.textContent =
      "Keep practising! You will get better with time. 💪";
  }

  // Show result section and Try Again button
  quizResult.hidden = false;
  tryAgainButton.hidden = false;

  // Hide Submit button after submission
  quizForm.querySelector('button[type="submit"]').hidden = true;
});


// =====================================
// 4. Try Again / Reset Quiz
// =====================================

tryAgainButton.addEventListener("click", function () {

  // Reset all selected answers
  quizForm.reset();

  // Remove previous answer feedback
  quizQuestions.forEach(question => {
    question.classList.remove("correct", "wrong");

    const feedback = question.querySelector(".answer-feedback");
    feedback.textContent = "";

    // Enable radio buttons again
    question.querySelectorAll("input").forEach(input => {
      input.disabled = false;
    });
  });

  // Clear messages and results
  quizMessage.textContent = "";
  quizResult.hidden = true;

  quizScore.textContent = "";
  scoreMessage.textContent = "";
  scoreBar.style.width = "0%";

  // Show Submit button again
  quizForm.querySelector('button[type="submit"]').hidden = false;

  // Hide Try Again button
  tryAgainButton.hidden = true;

  // Return to first question
  quizForm.querySelector('input[name="q1"]').focus();

});


// =====================================
// 5. Contact Form Validation
// =====================================

const contactForm = document.getElementById("contact-form");

if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const emailInput = document.getElementById("cf-email");
    const status = document.getElementById("cf-status");

    // trim() so that "   " does not count as filled
    const name = document.getElementById("cf-name").value.trim();
    const email = emailInput.value.trim();
    const message = document.getElementById("cf-message").value.trim();

    function showStatus(text, type) {
      status.textContent = text;          // textContent: user text is never run as HTML
      status.className = "is-" + type;
    }

    if (!name || !email || !message) {
      showStatus("Please fill in all the fields.", "error");
      return;
    }

    // type="email" lets the browser check the format
    if (!emailInput.checkValidity()) {
      showStatus("Please enter a valid email address.", "error");
      emailInput.focus();
      return;
    }

    showStatus("Thanks " + name + "! Opening your email app...", "success");

    // encodeURIComponent keeps &, ? and spaces from breaking the link
    const subject = encodeURIComponent("Message from " + name);
    const body = encodeURIComponent(
      "Name: " + name + "\nEmail: " + email + "\n\n" + message
    );
    window.location.href =
      "mailto:jainsambhav0343@gmail.com?subject=" + subject + "&body=" + body;
  });
}
