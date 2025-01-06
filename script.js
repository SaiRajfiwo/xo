// Select all the required elements
let boxes = document.querySelectorAll(".box");
let turnDisplay = document.querySelector(".bg");
let resultDisplay = document.querySelector("#results");
let playAgainButton = document.querySelector("#play-again");

let turn = "X"; // Initial turn
let isGameOver = false;
let playWithRobot = true; // Set to false for 2-player mode

// Clear board and add event listeners to boxes
boxes.forEach((box) => {
  box.innerHTML = "";
  box.addEventListener("click", () => {
    if (!isGameOver && box.innerHTML === "") {
      box.innerHTML = turn;
      checkWin();
      checkDraw();
      if (!isGameOver) {
        changeTurn();
        if (playWithRobot && turn === "O") {
          robotMove();
        }
      }
    }
  });
});

// Change turn logic
function changeTurn() {
  if (turn === "X") {
    turn = "O";
    turnDisplay.style.left = "85px";
  } else {
    turn = "X";
    turnDisplay.style.left = "0";
  }
}

// Check for a win
function checkWin() {
  const winConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  for (let condition of winConditions) {
    const [a, b, c] = condition;
    if (boxes[a].innerHTML !== "" &&
        boxes[a].innerHTML === boxes[b].innerHTML &&
        boxes[b].innerHTML === boxes[c].innerHTML) {
      isGameOver = true;
      highlightWinningCells(condition);
      resultDisplay.innerHTML = `${turn} wins!`;
      playAgainButton.style.display = "inline";
      return;
    }
  }
}

// Highlight the winning cells
function highlightWinningCells(condition) {
  condition.forEach((index) => {
    boxes[index].style.backgroundColor = "#08D9D6";
    boxes[index].style.color = "#000";
  });
}

// Check for a draw
function checkDraw() {
  if (!isGameOver) {
    const isDraw = Array.from(boxes).every((box) => box.innerHTML !== "");
    if (isDraw) {
      isGameOver = true;
      resultDisplay.innerHTML = "It's a draw!";
      playAgainButton.style.display = "inline";
    }
  }
}

// Robot (AI) logic for moves
function robotMove() {
  // Simple AI: Choose the first empty box
  let emptyBoxes = Array.from(boxes).filter((box) => box.innerHTML === "");
  if (emptyBoxes.length > 0) {
    setTimeout(() => {
      emptyBoxes[0].innerHTML = turn;
      checkWin();
      checkDraw();
      if (!isGameOver) {
        changeTurn();
      }
    }, 500); // Delay for realism
  }
}

// Reset the game
playAgainButton.addEventListener("click", () => {
  isGameOver = false;
  turn = "X";
  turnDisplay.style.left = "0";
  resultDisplay.innerHTML = "";
  playAgainButton.style.display = "none";

  boxes.forEach((box) => {
    box.innerHTML = "";
    box.style.removeProperty("background-color");
    box.style.color = "#fff";
  });
});
