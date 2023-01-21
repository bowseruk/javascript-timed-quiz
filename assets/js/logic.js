
// Sections that change if they are hidden
let startScreenDiv = document.getElementById("start-screen")
let questionsDiv = document.getElementById("questions");
let endScreenDiv = document.getElementById("end-screen");
// Start Screen
let startButton = document.getElementById("start")
// Parts used by questions
let questionTitleH2 = document.getElementById("question-title");
let choiceDiv = document.getElementById("choices");
// Parts used by end screen

// Game Object
var game = {
    // This is the list of questions
    questionBook: questionBook,
    // This variable is checked to see if the timer should continue.
    paused: false,
    // This variable is the timer state
    timer: 0,
    // Timer ticks in a second
    ticks: 10,
    // This is the starting time for the game in seconds
    gameLength: 200,
    // This is how much time should be removed for a mistake
    wrongPenalty: 10,
    // This is how much time should be added for a correct answer
    rightBonus: 10,
    // This tracks how many seconds where left
    timeBonus: 0,
    // This determines how many points each remaining second is worth
    timeBonusMultiplier: 0,
    // This is the timer function
    startTimer: function(seconds) {
        // Sets interval in variable
        let timerSpan = document.getElementById("time");
        game.timer = seconds * game.ticks;
        // Start the timer on an interval
        var timerInterval = setInterval(function () {
            // Stop the function if the timer is at or below zero
            if (game.timer <= 0) {
                // Stops execution of action at set interval
                clearInterval(timerInterval);
                timerSpan.textContent = 0;
                // Get the score ready
                let finalScoreSpan = document.getElementById("final-score");
                finalScoreSpan.textContent = game.score();
                displaySection(2);
                return
            // Pause the timer if the paused flag has been activated
            } else if (game.paused) {
                clearInterval(timerInterval);
                return
            }
            // If nothing has stopped it so far, increment the timer down and display it
            game.timer--;
            if(game.timer % game.ticks === 0)
            timerSpan.textContent = (game.timer / game.ticks);
        // The number below here is how many millisecons to run this function
        }, (1000/game.ticks));
    },
    startGame(){
        renderQuestion(game.questionBook.activeQuestion)
        game.startTimer(game.gameLength)
    },
    answerQuestion(int) {
        game.paused = true;
        if(game.questionBook.answerQuestion(int)) {
            game.timer += (game.rightBonus * game.ticks);
            
        } else {
            game.timer -= (game.wrongPenalty * game.ticks);
        }
        if (game.questionBook.quizComplete) {
            game.timeBonus = Math.floor((game.timer / game.ticks)*game.timeBonusMultiplier);
            game.timer = 0;
        } else {
            renderQuestion(game.questionBook.activeQuestion);
        }
        game.paused = false   
    },
    score() {
        return game.questionBook.score + game.timeBonus;
    }
}

startButton.addEventListener("click", game.startGame);

// This sets which of the main sections to display
function displaySection(int) {
    // Make an array of sections
    let section = [startScreenDiv, questionsDiv, endScreenDiv];
    // Loop through the array
    for (let i = 0; i < section.length; i++) {
        // Change the class if it has hide and its selected
        if ((i === int) && (section[i].classList.contains('hide'))) {
            section[i].classList.remove('hide');
            // Ignore the class if it is already hidden and not selected
        } else if (section[i].classList.contains('hide') || (i === int)) {
            continue
            // Hide everything else
        } else {
            section[i].classList.add('hide')
        }
    }
}

function renderQuestion(question) {
    // Clear last input
    choiceDiv.innerHTML = null;
    // Add the question to the title
    questionTitleH2.innerText = question.question;
    let answers = question.answers;
    if ((answers.length === 0) || (!answers instanceof Array)) {
        console.log("no answers")
        return
    }
    displaySection(1);
    for (let i = 0; i < answers.length; i++) {
        answerButton = document.createElement("button");
        answerButton.dataset.answer = i;
        answerButton.textContent = answers[i];
        answerButton.addEventListener("click", (e) => {
            game.answerQuestion(parseInt(e.target.dataset.answer));
        })
        choiceDiv.appendChild(answerButton);
    }
}