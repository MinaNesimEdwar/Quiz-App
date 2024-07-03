let form = document.getElementById("form");
let categoryMenu = document.getElementById("categoryMenu");
let difficultyOptions = document.getElementById("difficultyOptions");
let questionNumber = document.getElementById("questionNumber");
let startQuiz = document.getElementById("startQuiz");
let allQuestions;
let quiz;
startQuiz.addEventListener("click", async function () {
  let category = categoryMenu.value;
  let difficulty = difficultyOptions.value;
  let numOfQuestions = questionNumber.value;

  quiz = new Quiz(category, difficulty, numOfQuestions);
  allQuestions = await quiz.getAllQuestions();
  let myQuestion = new Question(0);
  myQuestion.display();
  form.classList.replace("d-block", "d-none");

  // console.log(allQuestions);
});

class Quiz {
  constructor(cat, diff, num) {
    this.category = cat;
    this.difficulty = diff;
    this.numQuestions = num;
    this.score = 0;
  }
  getApi() {
    return `https://opentdb.com/api.php?amount=${this.numQuestions}&category=${this.category}&difficulty=${this.difficulty}`;
  }
  async getAllQuestions() {
    let data = await fetch(this.getApi());
    let res = await data.json();
    let final = await res.results;

    return final;
  }
  displayScore() {
    let cartona = `<h2 class="fs-2 text-center">${(this.score==allQuestions.length)? "Congratulations 🥳 ":"Opsss 😫 "} Your Score Is ${this.score} Of ${allQuestions.length}</h2>
    <button
      class="again btn btn-dark mt-4 py-2 px-4 rounded-5 w-25 m-auto fs-5 d-block text-white"
    >
      Try Again
    </button>`;
    document.getElementById("finish").innerHTML=cartona;
    document.getElementById("finish").classList.replace("d-none","d-block");
    document.getElementById("myData").classList.replace("d-block","d-none");
  }
}

class Question {
  constructor(index) {
    this.index = index;
    this.category = allQuestions[index].category;
    this.difficulty = allQuestions[index].difficulty;
    this.correctAnswer = allQuestions[index].correct_answer;
    this.inCorrectAnswer = allQuestions[index].incorrect_answers;
    this.question = allQuestions[index].question;
    this.checked = false;
    this.allAnswers = this.getAllAnswers();
  }
  getAllAnswers() {
    let arr = [...this.inCorrectAnswer, this.correctAnswer];
    arr.sort();
    return arr;
  }

  display() {
    let cartona = `
        <div class="d-flex justify-content-between align-items-center mb-3 fw-bold text-secondary">
        <p>${this.category}</p>
        <span>${this.index + 1} Of ${allQuestions.length}</span>
      </div>
      <h3 class="text-center fw-bold">
        ${this.question}
      </h3>
      <div class="choices row my-4 ">
      ${this.allAnswers
        .map((ele) => {
          return `<div class="choice col-md-6 "><p class=" btn btn-outline-dark w-100">${ele}</p></div>`;
        })
        .join(" ")}
      
    </div>
      <h2 class="fs-1 fw-bold text-center">Score: ${quiz.score}</h2>
        `;
    document.getElementById("myData").innerHTML = cartona;
    document.getElementById("myData").classList.replace("d-none", "d-block");

    let choices = document.querySelectorAll(".choices .choice p");

    choices.forEach((ele) => {
      ele.addEventListener("click", () => {
        this.checkAnswer(ele);
      });
    });
  }

  checkAnswer(p) {
    if (!this.checked) {
      this.checked = true;
      if (p.innerHTML == this.correctAnswer) {
        p.classList.add("bg-success", "text-white");
        quiz.score++;
      } else {
        p.classList.add("bg-danger", "text-white");
      }
    }
    this.nextQuestion();
  }

  nextQuestion() {
    this.index++;
    if (this.index < allQuestions.length) {
      setTimeout(() => {
        let nextQuestion = new Question(this.index);
        nextQuestion.display();
      }, 2000);
    } else {
      quiz.displayScore();
      document.querySelector(".again").addEventListener("click",function(){
        window.location.reload()
      })
    }
  }
}

