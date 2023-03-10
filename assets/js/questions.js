// Questions in the form of a 2d array. These will be read into the questionBook on page start up.
// The first item in the nested array is the question, then the correct answer, then the topic, and then an array of incorrect answers. This can be any length, as the code is dynamic. 
let questionsList = [
    ["How do you put the elements of an array in order?", ".sort()", "Arrays", [".arrange()", ".order()", ".place()"]],
    ["Which of these is the quick form for to the power of?", "**", "Math", ["^", "e"]],
    ["Javascript has classes?", "True", "Classes", ["False"]],
    ["What function rounds down a number?", "Math.floor()", "Math", ["Math.roundDown()","Math.round()","math.round()","math.floor()"]],
    ["What function creates a random number between 0 - 1?", "Math.random()", "Math", ["Math.surprise()","Math.rand()"]],
    ["Which function in a class is called when a class object is initiated?", "constructor()", "Classes", ["new()", "make()", "__init__()", "class()"]],
]

// Shuffle an array using most accepted answer on Stack Overflow
function shuffle(array) {
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
        this._possibleAnswers = shuffle(this._possibleAnswers);
        // The correct index is stored for the logic
        this._correctIndex = this._possibleAnswers.indexOf(this._correctAnswer);
    }
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

class QuestionBook {
    constructor() {
        // This points to the current question
        this._index = 0;
        this._questions = [];
        this._topicAnswered = [];
        this._score = [];
        this._questions = shuffle(this._questions);
        this._questionsComplete = false;
    }
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
            this._questions = shuffle(this._questions);
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
        if ((this._index + 1) < this._questions.length) {
            // Move to the next question
            this._index++;
        } else {
            // Shuffle the questions when it gets to the end and start at the beginning again
            this._questions = shuffle(this._questions);
            this._questionsComplete = true;
        }
    }
    // Shuffle the order of the questions
    shuffleQuestions(){
        this._questions = shuffle(this._questions);
        // Reset the index on shuffle
        this._index = 0; 
        this.quizComplete = false;
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

// This has to loaded up for the game object to use
var questionBook = new QuestionBook();
// This loads all the questions into memory
questionsList.forEach((e) => {
    let loopQuestion = new Question(e[0],e[1],e[2],e[3]);
    questionBook.addQuestion(loopQuestion);
})