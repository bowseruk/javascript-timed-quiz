timer = document.getElementById("time")

secondsLeft = 10;

timer.addEventListener("click", setTime);

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
      timer.textContent = secondsLeft;
    }, 1000);
  }

