
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
    paused: false,
    timer: 0,
    gameLength: 200,
    wrongPenalty: 10,
    rightBonus: 10,
    startTimer: function(seconds) {
        // Sets interval in variable
        let timerSpan = document.getElementById("time");
        game.timer = seconds;
        var timerInterval = setInterval(function () {
            if (game.timer <= 0) {
                // Stops execution of action at set interval
                clearInterval(timerInterval);
                timerSpan.textContent = 0;
                // Get the score ready
                let finalScoreSpan = document.getElementById("final-score");
                finalScoreSpan.textContent = game.score();
                displaySection(2);
                return
                // Calls function to create and append image
            } else if (game.paused) {
                clearInterval(timerInterval);
                return
            }
            game.timer--;

            timerSpan.textContent = game.timer;
            
        }, 1000);
    },
    startGame(){
        renderQuestion(game.questionBook.activeQuestion)
        game.startTimer(game.gameLength)
    },
    answerQuestion(int) {
        game.paused = true;
        if(game.questionBook.answerQuestion(int)) {
            game.timer += game.rightBonus;
            
        } else {
            game.timer -= game.wrongPenalty;
        }
        game.paused = false
        renderQuestion(game.questionBook.activeQuestion);
    },
    score() {
        return game.questionBook.score;
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