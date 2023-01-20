// Elements used in the script
scoreList = document.getElementById("highscores")
resetButton = document.getElementById("clear")

function renderScore() {
    scoreList.innerText = null;
    if (localStorage.getItem("score") === null) {
        return
    }
    score = JSON.parse(localStorage.getItem("score"))
    score.forEach((element) => {
        var li = document.createElement("li")
        li.innerText =`${element[0]} -- ${element[1]}`
        scoreList.appendChild(li)
    })
}

function clearScore() {
    score = null;
    localStorage.removeItem("score")
    renderScore()
}

resetButton.addEventListener("click", clearScore);
renderScore();

