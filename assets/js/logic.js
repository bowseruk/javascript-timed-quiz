let timerSpan = document.getElementById("time");
// Sections that change if they are hidden
let startScreenDiv = document.getElementById("start-screen")
let questionsDiv = document.getElementById("questions");
let endScreen = document.getElementById("end-screen");

// Parts used by questions
let questionTitleH2 = document.getElementById("question-title");
let choiceDiv = document.getElementById("choices");


secondsLeft = 10;

timerSpan.addEventListener("click", setTime);

// This sets which of the main sections to display
function displaySection(int) {
    // Make an array of sections
    let section = [startScreenDiv,questionsDiv,endScreen];
    // Loop through the array
    for (let i = 0; i < section.length; i++ ) {
        // Change the class if it has hide and its selected
        if ((i === int) && (section[i].classList.contains('hide'))) {
            section[i].classList.remove('hide');
        // Ignore the class if it is already hidden and not selected
        } else if (section[i].classList.contains('hide')) {
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
    questionTitleH2 = question.question;
    let answers = question.answers;
    if ((answers.length === 0) || (typeof anwsers !== 'array')){
        return
    }
    displaySection(1);
    for (let i=0; i < answers.length; i++) {
        answerButton = document.createElement("button");
        answerButton.dataset.answer = i;
        answerButton.textContent = answers[i];
        answerButton.addEventListener("click", (e) => {
            question.answerQuestion(this.dataset.answer);
            renderQuestion(question);
        })
        choiceDiv.appendChild(answerButton);
    }

}

function setTime() {
    // Sets interval in variable
    var timerInterval = setInterval(function() {
      if(secondsLeft <= 0) {
        // Stops execution of action at set interval
        clearInterval(timerInterval);
        return
        // Calls function to create and append image
      }
      secondsLeft--;
      timerSpan.textContent = secondsLeft;
    }, 1000);
  }

renderQuestion(questionBook.activeQuestion);