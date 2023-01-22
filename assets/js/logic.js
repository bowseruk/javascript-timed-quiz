
// Questions in the form of a 2d array. These will be read into the questionBook on page start up.
// The first item in the nested array is the question, then the correct answer, then the topic, and then an array of incorrect answers. This can be any length, as the code is dynamic. 
let questionsList = [
    ["How do you put the elements of an array in order?", ".sort()", "Arrays", [".arrange()", ".order()", ".place()"]],
    ["Which of these is the quick form for to the power of?", "**", "Math", ["^", "e"]],
    ["Javascript has classes?", "True", "Classes", ["False"]],
    ["What function rounds down a number?", "Math.floor()", "Math", ["Math.roundDown()", "Math.round()", "math.round()", "math.floor()"]],
    ["What function creates a random number between 0 - 1?", "Math.random()", "Math", ["Math.surprise()", "Math.rand()"]],
    ["Which function in a class is called when a class object is initiated?", "constructor()", "Classes", ["new()", "make()", "__init__()", "class()"]],
]
// Question class - This is what the questions are loaded into
class Question {
    // Constructor takes a question as a string, correct answer as a string, topic as a string and incorrect answers as a list of strings
    constructor(question, correctAnswer, topic, incorrectAnswers) {
        // Set the class variables
        this._question = question;
        this._correctAnswer = correctAnswer;
        this._questionTopic = topic;
        this._incorrectAnswers = [];
        // Loop through the incorrect answers in a loop, allows for error checking on each one.
        for (let i = 0; i < incorrectAnswers.length; i++) {
            this._incorrectAnswers.push(incorrectAnswers[i]);
        }
        // Possible answers has the wrong and the right answers
        this._possibleAnswers = this._incorrectAnswers.slice();
        this._possibleAnswers.push(this._correctAnswer);
        this.shuffleAnswers()
    };
    // Static method to shuffle an array
    shuffle(array) {
        let currentIndex = array.length, randomIndex;
        // While there remain elements to shuffle.
        while (currentIndex != 0) {

            // Pick a remaining element.
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]];
        }
        // Return the shuffled array
        return array;
    }

    // This allows the question to be answered. You input the index, and it returns true if it matches the correct answer, else it returns false.
    answerQuestion(int) {
        if (int === this._correctIndex) {
            this.shuffleAnswers()
            return true
        }
        this.shuffleAnswers()
        return false;
    }
    shuffleAnswers() {
        // The possible answers are shuffled
        this._possibleAnswers = this.shuffle(this._possibleAnswers);
        // The correct index is stored for the logic
        this._correctIndex = this._possibleAnswers.indexOf(this._correctAnswer);
    }
    // Getters
    get answers() {
        return this._possibleAnswers;
    }
    get question() {
        return this._question;
    }
    get questionTopic() {
        return this._questionTopic;
    }
    get numberOfAnswers() {
        return this._possibleAnswers.length
    }
}
// This class describes a book of questions
class QuestionBook {
    // Constructor for the class
    constructor() {
        // This points to the current question
        this._index = 0;
        this._questions = [];
        this._topicAnswered = [];
        this._score = [];
        this._questions = this.shuffle(this._questions);
        this._questionsComplete = false;
        this._maximumQuestions = this.numberOfQuestions;
    };
    //shuffles an array
    shuffle(array) {
        let currentIndex = array.length, randomIndex;
        // While there remain elements to shuffle.
        while (currentIndex != 0) {

            // Pick a remaining element.
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]];
        }
        // Return the shuffled array
        return array;
    };
    // This function added questions onto the book.
    addQuestion(question) {
        let question_added = false;
        for (let i = 0; i < arguments.length; i++) {
            // Check correct type has been passed
            if (!arguments[i] instanceof Question) {
                console.log("Incorrect format of question passed.");
                continue;
            }
            this._questions.push(arguments[i]);
            console.log(arguments[i]);

            question_added = true;
        }
        if (question_added) {
            this._maximumQuestions = this.numberOfQuestions;
            this._questions = this.shuffle(this._questions);
        }
        return question_added;
    }
    // This checks if the correct answer has been given and moves to the next question
    answerQuestion(int) {
        // Checks a question exists
        if (this._questions.length === 0) {
            console.log("No questions have been loaded, but an answer given.")
            return false;
        }
        // set correct to false and push the topic to the topicAnswered array
        let correct = false
        this._topicAnswered.push(this.activeQuestion.questionTopic);
        // This checks the answer is correct using the method on the Question class - pushes one if its correct, else zero if incorrect.
        if (this.activeQuestion.answerQuestion(int)) {
            this._score.push(1);
            correct = true
        } else {
            this._score.push(0);
        }
        this.nextQuestion();
        return correct;
    }
    // Move to the next question - add as callable function incase I implement a skip button
    nextQuestion() {
        if ((this._index + 1) < this._maximumQuestions) {
            // Move to the next question
            this._index++;
        } else {
            // Set quiz complete on finishing
            this._questionsComplete = true;
        }
    }
    // Shuffle the order of the questions
    shuffleQuestions() {
        this._questions = shuffle(this._questions);
        // Reset the index on shuffle
        this._index = 0;
        this.quizComplete = false;
        this._score = [];
    }
    // Getters to allow logic before giving private variables if required later
    get activeQuestion() {
        return this._questions[this._index];
    }
    get question() {
        return this.activeQuestion.question;
    }
    get answers() {
        return this.activeQuestion.answers;
    }
    get score() {
        return this._score.reduce((sum, a) => sum + a, 0);
    }
    get quizComplete() {
        return this._questionsComplete;
    }
    get numberOfQuestions() {
        return this._questions.length
    }
    get numberOfAnswers() {
        return this.activeQuestion.answers.length
    }
}

// This class is what will be used by the game
class Model {
    // This is called when the model is made
    constructor(questionBook, ticks, secondsPerQuestion, penalty, bonus, timeBonusMultiplier) {
        // The status of the game - start at the beginning at creation
        this._activeMode = 0;
        // The status of the game
        this._modes = ["start", "running", "end"];
        // This variable is checked to see if the timer should continue.
        this._paused = false;
        // This variable is the timer state
        this._timer = 0;
        // Timer ticks per second - higher means more calculations, but smoother gameply.
        this.ticks = ticks;
        // Import a questionBook
        this._questionBook = questionBook;
        // This is the starting time for the game in seconds
        this.secondsPerQuestion = secondsPerQuestion;
        // The time removed for an incorrect answer
        this.penalty = penalty;
        // This is how much time should be added for a correct answer
        this.bonus = bonus;
        // This tracks how many seconds where left
        this._timeBonus = 0;
        // This determines how many points each remaining second is worth
        this.timeBonusMultiplier = timeBonusMultiplier;
    };
    // Increment the timer every tick
    incrementTimer() {
        // Check that the timer has not finished
        if (this._timer <= 0) {
            // Set the timer to zero in case of overflow
            this._timer = 0;
            // Set the mode to complete
            this._activeMode = 2;
            // Finish the loop
            return false
            // If the game is paused don't increment
        } else if (this._paused) {
            // Finish the function on pause
            return false
        }
        // increment the timer
        this._timer--;
        // Return true to indicate the timer has incremented
        return true
    };
    // This is the timer function
    startTimer() {
        // Sets interval in variable
        this._timer = this._gameLength * this._ticks;
        this._activeMode = 1;
    };
    // Start the game
    startGame() {
        // 
        this.startTimer();
    };
    answerQuestion(int) {
        // Set the answer to false
        let correct = false;
        // IF the correct answer has been given, give any bonus and set correct to true
        if (this._questionBook.answerQuestion(int)) {
            this._timer += (this._rightBonus * this._ticks);
            correct = true;
            // Give a penalty if it is incorrect
        } else {
            this._timer -= (this._wrongPenalty * this._ticks);
        }
        // Check if the quiz has been completed, and change the mode if it has
        if (this._questionBook.quizComplete) {
            this._activeMode = 2;
            // The number of seconds left is recorded as the time bonus
            this._timeBonus = Math.floor((this._timer / this._ticks) * this._timeBonusMultiplier);
            this._timer = 0;
        }
        return correct;
        // game.paused = false   
    };
    // This resets the game
    reset_game() {
        this._timer = 0;
        this._activeMode = 0;
        // Shuffle the questions for next time
        this._questionBook.shuffleQuestions();
    };
    // This function checks if a number is a valid input
    validate_number(intValue, minValue, maxValue, defaultValue) {
        let value = defaultValue;
        if ((intValue >= minValue) && (intValue <= maxValue) && (typeof intValue === "number")) {
            value = intValue;
        }
        return value;
    }
    // This sets the number of refreshes per second. Higher numbers give a more responsive game, but may be more demanding.
    set ticks(ticksPerSecond) {
        // Default number of ticks is 10
        this._ticks = this.validate_number(ticksPerSecond, 1, 1000, 10);
    }
    // Set the time given per question
    set secondsPerQuestion(secondsPerQuestion) {
        // Default value
        let time = this.validate_number(secondsPerQuestion, 1, 60, 5);
        this._secondsPerQuestion = secondsPerQuestion
        this._gameLength = this._questionBook.numberOfQuestions * time;
    }
    //  This gets the time per question that has been set
    get secondsPerQuestion() {
        return this._secondsPerQuestion;
    }
    // This  adds a new question book
    set questionBook(questionBook) {
        if (questionBook instanceof QuestionBook) {
            this._questionBook = questionBook;
            this.secondsPerQuestion = this._secondsPerQuestion;
            return true;
        }
        return false;
    }
    // Set the time penalty for an incorrect answer
    set penalty(seconds) {
        // Default value
        this._wrongPenalty = this.validate_number(seconds, 0, this._gameLength, 2);
        return true;
    }
    set bonus(seconds) {
        this._rightBonus = this.validate_number(seconds, 0, this._gameLength, 2);
        return true;
    }
    // Set the multiplier applied to left over seconds at the end of the game.
    set timeBonusMultiplier(multiplier) {
        this._timeBonusMultiplier = this.validate_number(multiplier, 0, this._gameLength, 2);
        return true;
    }
    // Get the score
    get score() {
        return this._questionBook.score + this._timeBonus;
    };
    // Get the current timer
    get timer() {
        return Math.floor(this._timer / this._ticks);
    }
    get ticks() {
        return this._ticks;
    }
    // Get the mode the model is in
    get activeMode() {
        return this._activeMode;
    }
    // This returns the question object for the active question
    get activeQuestion() {
        return this._questionBook.activeQuestion;
    }
    // This returns the current question for the active question
    get question() {
        return this._questionBook.activeQuestion.question;
    }
    // This returns an array of the current answers
    get answers() {
        return this._questionBook.activeQuestion.answers;
    }
    // This returns the number of answers in the active question
    get numberOfAnswers() {
        return this._questionBook.activeQuestion.numberOfAnswers;
    }
    // This returns the number of questions in the loaded questionbook
    get numberOfQuestions() {
        return this._questionBook.numberOfQuestions;
    }
    //
    get modes() {
        return this._modes;
    }
}
// This class controls what is shown on the page
class View {
    // The constructor mostly takes in elements on the page to control
    constructor(startElement, questionElement, endElement, scoreElement, timerElement, feedbackElement, questionTitleElement, choiceElement, faviconElement) {
        // Start as the HTML page is
        this._activeSection = 0;
        this._sections = [startElement, questionElement, endElement];
        this._scoreElement = scoreElement;
        this._timerElement = timerElement;
        this._feedbackElement = feedbackElement;
        this._questionTitleElement = questionTitleElement;
        this._choiceElement = choiceElement;
        this._rightAudio = new Audio('assets/sfx/correct.wav');
        this._wrongAudio = new Audio('assets/sfx/incorrect.wav');
        this._favicons = ["assets/images/tick.ico", "assets/images/cross.ico"]
        this._activeFavicon = 0;
        this._faviconElement = faviconElement;
    };
    // This checks the number is valid
    validate_number(intValue, minValue, maxValue, defaultValue) {
        let value = defaultValue;
        if ((intValue >= minValue) && (intValue <= maxValue) && (typeof intValue === "number")) {
            value = intValue;
        }
        return value;
    }
    // Set the score to display
    set score(number) {
        let displayNum = this.validate_number(number, 0, 999, 0);
        this._scoreElement.innerText = displayNum;
        return true;
    };
    // Set the time to display
    set timer(number) {
        let displayNum = this.validate_number(number, 0, 9999, 0);
        this._timerElement.innerText = displayNum;
        return true;
    };
    // Set the section to show
    set section(number) {
        let section = this.validate_number(number, 0, this._sections.length, 0);
        if (section !== this._activeSection) {
            this._sections[this._activeSection].classList.toggle("hide");
            this._sections[section].classList.toggle("hide");
            this._activeSection = section;
            return true;
        }
        return false;
    };
    // Set the feedback message
    set feedback(message) {
        if (message === null) {
            this._feedbackElement.innerText = null;
            this._feedbackElement.classList.add("hide");
            return false;
        } else {
            this._feedbackElement.innerText = message;
            this._feedbackElement.classList.remove("hide");
            return true;
        }
    };
    // Set the displayed question. If it is null the question area is cleared
    set question(question) {
        if (question === null) {
            this._questionTitleElement.innerHTML = null;
            this._choiceElement.innerHTML = null;
        } else if (typeof question === "string") {
            this._questionTitleElement.innerText = question;
        };
    };
    set favicon(int) {
        this._faviconElement.setAttribute("href", this._favicons[this.validate_number(int, 0, this._favicons.length, 0)]);

    }
    // Adds an answer box to the current question - pass in the function you want the button to perform
    addAnswer(answer, index) {
        let answerButton = document.createElement("button");
        answerButton.dataset.answer = index;
        answerButton.textContent = answer;
        this._choiceElement.appendChild(answerButton);
        return answerButton;
    };

}

// Controller
class Controller {
    constructor(model, view, initialInputElement) {
        this._model = model;
        this._view = view;
        this._initialInputElement = initialInputElement;
    };
    startGame() {
        this.startTimer();
        this.renderQuestion();
    };
    renderQuestion() {
        this._view.question = null;
        this.renderDisplay()
        this._view.question = this._model.question;
        for (let i = 0; i < this._model.numberOfAnswers; i++) {
            this._view.addAnswer(this._model.answers[i], i).addEventListener("click", (e) => {
                this.answerQuestion(parseInt(e.target.dataset.answer));
            });
        };
    };
    answerQuestion(int) {
        if (this._model.answerQuestion(int)) {
            this._view.feedback = "Correct";
            this._view._rightAudio.play();
            this._view.favicon = 0;

        } else {
            this._view.feedback = "Wrong";
            this._view._wrongAudio.play();
            this._view.favicon = 1;
        }
        this.renderQuestion();
    };
    // This updates the timer and checks the correct page is set
    renderDisplay() {
        this._view.section = this.activeMode;
        if (this._model.activeMode === 2) {
            this._view.score = this._model.score;
        }
        this._view.timer = this._model.timer;
    };
    startTimer() {
        // Sets interval in variable
        this._model.startTimer();
        this.renderDisplay();
        // Start the timer on an interval
        this.timerInterval = setInterval(() => {
            // Stop the function if the timer is at or below zero
            if (this.activeMode === 2) {
                // Stops execution of action at set interval
                this.feedback = null;
                this.renderDisplay();
                clearInterval(this.timerInterval);
                return
            } else if (this.paused) {
                return
            }
            // If nothing has stopped it so far, increment the timer down and display it
            this.incrementTimer();
            this.renderDisplay();
            // The number below here is how many millisecons to run this function            
        }, (Math.floor(1000 / this._model.ticks)));
    };
    enterInitials() {
        this._view.feedback = null;
        let initials = this._initialInputElement.value;
        if (initials === "") {
            this._view.feedback = "At least one character must be entered!";
            return;
        }
        this.updateScoreBoard(initials, this.score);
        window.location.href = "highscores.html";

    };
    updateScoreBoard(initials, score) {
        let scoreboard = this.scoreboard;
        if (scoreboard.length < 10) {
            scoreboard.push([initials, score])
            this.scoreboard = scoreboard;
            return true;
        }
        let minScore = [scoreboard[0][1],0];
        for (let i = 1; i < this.scoreboard.length; i++) {
            if (scoreboard[i][1] < minScore[0]){
                minScore = [scoreboard[i][1],i];
            };
        };
        if (score > minScore[0]) {
            scoreboard[minScore[1]] = [initials, score];
            this.scoreboard = scoreboard;
            return true;
        }
        return false;
    };
    incrementTimer() {
        this._model.incrementTimer();
    };
    set model(model) {
        if (model instanceof Model) {
            this._model = model;
            return true;
        };
        return false;
    };
    set view(view) {
        if (view instanceof View) {
            this._view = view;
            return true;
        };
        return false;
    };
    set scoreboard(scoreboard) {
        scoreboard.sort(function(a,b) {
            return b[1]-a[1]
        });
        localStorage.setItem("score",JSON.stringify(scoreboard))
    }
    get activeMode() {
        return this._model.activeMode;
    };
    get paused() {
        return this._model.paused;
    };
    get score() {
        return this._model.score;
    }
    get scoreboard() {
        if (localStorage.getItem("score") === null){
            return [];
        };
        return JSON.parse(localStorage.getItem("score"));
    };
};

// This has to loaded up for the game object to use
var questionBook = new QuestionBook();
// This loads all the questions into memory
questionsList.forEach((e) => {
    let loopQuestion = new Question(e[0], e[1], e[2], e[3]);
    questionBook.addQuestion(loopQuestion);
});
// Start the model
game = new Model(questionBook, 10, 5, 2, 0, 0);

page = new View(document.getElementById("start-screen"), document.getElementById("questions"), document.getElementById("end-screen"), document.getElementById("final-score"), document.getElementById("time"), document.getElementById("feedback"), document.getElementById("question-title"), document.getElementById("choices"), document.getElementById("favicon"));

controller = new Controller(game, page, document.getElementById("initials"));

// Start Button
let startButton = document.getElementById("start");
startButton.addEventListener("click", () => {
    controller.startGame();
});
// Submit Button
let submitButton = document.getElementById("submit");
submitButton.addEventListener("click", () => {
    controller.enterInitials();
});

