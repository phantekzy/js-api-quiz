// Step 1 Elements
const quizInput = document.getElementById('quiz-input')
const quizSelect = document.getElementById('quiz-select')
const nextBtn = document.querySelector('.next')
const greetings = document.getElementById('greetings')

// Step 2 Elements
const quizNumber = document.getElementById('quiz-number')
const questionTxt = document.getElementById('question-txt')
const answers = document.querySelector('.answers')
const nextBtnQuiz = document.querySelector('.next-quiz')

// App State
let userName = ''
let score = 0
let totalQuestions = 5
let questions = []
let currentQuestionIndex = 0

// Fetches and populates quiz categories
function loadCategories() {
  fetch('https://opentdb.com/api_category.php')
    .then(res => res.json())
    .then(data => {
      data.trivia_categories.forEach(cat => {
        const option = document.createElement('option')
        option.value = cat.id
        option.textContent = cat.name
        quizSelect.appendChild(option)
      })
    })
}

// Validates user input and fetches questions
function collectInfo() {
  const name = quizInput.value.trim()
  const category = quizSelect.value.trim()

  if (!name || !category) {
    alert('Please enter both your name and the quiz category!')
    return
  }

  userName = name
  const url = `https://opentdb.com/api.php?amount=5&category=${category}&type=multiple`

  fetch(url)
    .then(res => res.json())
    .then(data => {
      questions = data.results
      currentQuestionIndex = 0
      score = 0
      startQuiz()
    })
}

// Switch to quiz screen and show first question
function startQuiz() {
  document.querySelector('.step1').style.display = "none"
  document.querySelector('.step2').style.display = "flex"
  showQuestions()
}

// Renders current question and answers
function showQuestions() {
  const question = questions[currentQuestionIndex]

  quizNumber.textContent = `Quiz number ${currentQuestionIndex + 1}`
  questionTxt.innerHTML = question.question
  greetings.textContent = `Hello ${userName}, choose the correct answer!`

  const allAnswers = [...question.incorrect_answers, question.correct_answer]
  const shuffled = allAnswers.sort(() => Math.random() - 0.5)

  answers.innerHTML = ''

  shuffled.forEach(answer => {
    const btn = document.createElement('button')
    btn.classList.add('btn')
    btn.textContent = answer
    btn.addEventListener('click', () => checkAnswer(answer, question.correct_answer))
    answers.appendChild(btn)
  })

  nextBtnQuiz.disabled = true
}

// Checks selected answer and shows feedback
function checkAnswer(selected, correct) {
  const allBtns = document.querySelectorAll('.btn')

  allBtns.forEach(btn => {
    btn.disabled = true

    if (btn.textContent === correct) {
      btn.style.background = 'green'
    } else if (btn.textContent === selected) {
      btn.style.background = 'red'
    }
  })

  if (selected === correct) {
    score++
  }

  nextBtnQuiz.disabled = false
}

// Shows final result and restart option
function showResults() {
  const step2 = document.querySelector('.step2')
  step2.innerHTML = `
    <div class="quiz result-screen">
      <h1>🎉 Bravo, ${userName} you finished the quiz!</h1>
      <p>Your score is <span class="score">${score} / ${totalQuestions}</span></p>
      <button class="restart">🔁 Restart Quiz</button>
    </div>
  `

  document.querySelector('.restart').addEventListener('click', () => {
    location.reload()
  })
}

// Event listeners
nextBtn.addEventListener('click', collectInfo)

nextBtnQuiz.addEventListener('click', () => {
  currentQuestionIndex++
  if (currentQuestionIndex < questions.length) {
    showQuestions()
  } else {
    showResults()
  }
})

// Load quiz categories on page load
loadCategories()

