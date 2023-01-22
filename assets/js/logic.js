// Sections that change if they are hidden
let startScreenDiv = document.getElementById("start-screen")
let questionsDiv = document.getElementById("questions");
let endScreenDiv = document.getElementById("end-screen");
// Parts used by questions

let choiceDiv = document.getElementById("choices");
// Parts used by end screen

// Game Object - The Model
var game = {
    // The status of the game
    activeMode: 0,
    // The possible states of the game
    modes: ["start", "running", "end"],
    // This is the list of questions
    questionBook: questionBook,
    // This variable is checked to see if the timer should continue.
    paused: false,
    // This variable is the timer state
    timer: 0,
    // Timer ticks in a second
    ticks: 10,
    // This is the starting time for the game in seconds
    gameLength: 20,
    // This is how much time should be removed for a mistake
    wrongPenalty: 10,
    // This is how much time should be added for a correct answer
    rightBonus: 10,
    // This tracks how many seconds where left
    timeBonus: 0,
    // This determines how many points each remaining second is worth
    timeBonusMultiplier: 0,
    incrementTimer() {
        if (game.timer <= 0) {
            game.timer = 0;
            game.activeMode = 2;
            return false
        } else if (game.paused) {
            return false
        }
        game.timer--;
        return true
    },
    // This is the timer function
    startTimer() {
        // Sets interval in variable
        game.timer = game.gameLength * game.ticks;
        game.activeMode = 1;
    },
    startGame(){
        renderQuestion(game.questionBook.activeQuestion)
        game.startTimer()
    },
    answerQuestion(int) {
        // game.paused = true;
        let correct = false;
        if(game.questionBook.answerQuestion(int)) {
            game.timer += (game.rightBonus * game.ticks);
            correct = true;
        } else {
            game.timer -= (game.wrongPenalty * game.ticks);
        }
        if (game.questionBook.quizComplete) {
            game.activeMode = 2;
            game.timeBonus = Math.floor((game.timer / game.ticks)*game.timeBonusMultiplier);
            game.timer = 0;
        }
        return correct;
        // game.paused = false   
    },
    score() {
        return game.questionBook.score + game.timeBonus;
    },
    getTimer() {
        return Math.floor(game.timer / game.ticks)
    }
}

// This is the view component of the game
var display = {
    activeSection: 0,
    sections: [
        document.getElementById("start-screen"),
        document.getElementById("questions"),
        document.getElementById("end-screen"),
    ],
    updateScore(int) {
        let displayNum = 0;
        if (int > 0) {
            displayNum = int;
        };
        let finalScoreSpan = document.getElementById("final-score");
        finalScoreSpan.innerText = int
    },
    updateTimer(int) {
        let displayNum = 0;
        if (int > 0) {
            displayNum = int;
        };
        let timerSpan = document.getElementById("time")
        timerSpan.innerText = displayNum
    },
    displaySection(int) {
        let section = 0;
        if ((int < this.sections.length) && (int >= 0)) {
            section = int
        }
        if (section !== display.activeSection) {
            display.sections[display.activeSection].classList.toggle("hide");
            display.sections[section].classList.toggle("hide");
            display.activeSection = section;
            return true;
        }
        return false;
    },
    displayFeedback(message) {
        let feedbackDiv = document.getElementById("feedback");
        feedbackDiv.innerText = message;
        feedbackDiv.classList.remove("hide");
    },
    clearFeedback() {
        let feedbackDiv = document.getElementById("feedback");
        feedbackDiv.innerText = null;
        feedbackDiv.classList.add("hide");
    },
    clearQuestion() {
        let choiceDiv = document.getElementById("choices");
        choiceDiv.innerHTML = null;
        let questionTitleH2 = document.getElementById("question-title");
        questionTitleH2.innerText = null;
    },
    addQuestion(question) {
        let questionTitleH2 = document.getElementById("question-title");
        questionTitleH2.innerText = question;
    },
    addAnswer(answer) {
        answerButton = document.createElement("button");
        answerButton.dataset.answer = answer[1];
        answerButton.textContent = answer[0];
        answerButton.addEventListener("click", (e) => {
            controller.answerQuestion(parseInt(e.target.dataset.answer));
        })
        let choiceDiv = document.getElementById("choices");
        choiceDiv.appendChild(answerButton);
    },

}

// Controller
var controller = {
    model: game,
    view: display,
    startGame() {
        controller.startTimer()
        controller.renderQuestion()
    },
    renderQuestion(){
        controller.view.clearQuestion();
        controller.view.addQuestion(controller.model.questionBook.question);
        for (i = 0; i < controller.model.questionBook.answers.length; i++) {
            controller.view.addAnswer([controller.model.questionBook.answers[i],i])
        }
    },
    answerQuestion(int) {
        controller.model.answerQuestion(int)
        controller.view.clearQuestion()
        controller.renderQuestion()
    },
    renderDisplay(){
        controller.view.displaySection(controller.model.activeMode);
        if (game.activeMode === game.modes.indexOf("end")) {
            display.updateScore(game.score());
        }
        display.updateTimer(game.getTimer());
    },
    startTimer(){
       // Sets interval in variable
       controller.model.startTimer();
       controller.renderDisplay();
       // Start the timer on an interval
       var timerInterval = setInterval(function () {
           // Stop the function if the timer is at or below zero
           if (controller.model.activeMode === controller.model.modes.indexOf("end")) {
               // Stops execution of action at set interval
               controller.renderDisplay()
               clearInterval(timerInterval);
               return
           }
           // If nothing has stopped it so far, increment the timer down and display it
           controller.model.incrementTimer();
           controller.renderDisplay();
       // The number below here is how many millisecons to run this function
       }, (Math.floor(1000/controller.model.ticks)));
    },
    enterInitials() {
        var initialsInput = document.getElementById("initials");
        controller.view.clearFeedback();
        initials = initialsInput.value
        if (initials === "") {
            controller.view.displayFeedback("At least one character must be entered!");
            return
        }
        if (localStorage.getItem("score") === null) {
            scoreboard = []
        } else {
            scoreboard = JSON.parse(localStorage.getItem("score"));
        }
    },
}

// Start Button
let startButton = document.getElementById("start");
startButton.addEventListener("click", controller.startGame);
// Submit Button
let submitButton = document.getElementById("submit");
submitButton.addEventListener("click", controller.enterInitials);