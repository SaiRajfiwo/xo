// Select all the required elements
let boxes = document.querySelectorAll(".box");
let turnDisplay = document.querySelector(".bg");
let resultDisplay = document.querySelector("#results");
let playAgainButton = document.querySelector("#play-again");
let difficultySelector = document.querySelector("#difficulty"); // Add a difficulty selector

let turn = "X"; // Initial turn
let isGameOver = false;
let playWithRobot = true; // Set to false for 2-player mode
let difficulty = "easy"; // Default difficulty

// Event listener for difficulty change
difficultySelector.addEventListener("change", (e) => {
  difficulty = e.target.value;
});

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

// Robot (AI) logic for moves based on difficulty
function robotMove() {
  let emptyBoxes = Array.from(boxes).filter((box) => box.innerHTML === "");
  if (emptyBoxes.length === 0) return;

  setTimeout(() => {
    if (difficulty === "easy") {
      // Easy: Random move
      const randomIndex = Math.floor(Math.random() * emptyBoxes.length);
      emptyBoxes[randomIndex].innerHTML = turn;
    } else if (difficulty === "medium") {
      // Medium: Random move with some winning checks
      let move = findWinningMove("O") || findWinningMove("X") || getRandomMove(emptyBoxes);
      move.innerHTML = turn;
    } else if (difficulty === "hard") {
      // Hard: Best move using Minimax
      let bestMove = findBestMove();
      if (bestMove !== null) {
        boxes[bestMove].innerHTML = turn;
      }
    }

    checkWin();
    checkDraw();
    if (!isGameOver) {
      changeTurn();
    }
  }, 500); // Delay for realism
}

// Utility functions
function getRandomMove(emptyBoxes) {
  return emptyBoxes[Math.floor(Math.random() * emptyBoxes.length)];
}

function findWinningMove(player) {
  const winConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  for (let condition of winConditions) {
    const [a, b, c] = condition;
    if (boxes[a].innerHTML === player && boxes[b].innerHTML === player && boxes[c].innerHTML === "") {
      return boxes[c];
    }
    if (boxes[a].innerHTML === player && boxes[c].innerHTML === player && boxes[b].innerHTML === "") {
      return boxes[b];
    }
    if (boxes[b].innerHTML === player && boxes[c].innerHTML === player && boxes[a].innerHTML === "") {
      return boxes[a];
    }
  }
  return null;
}

function findBestMove() {
  // Minimax algorithm
  let bestScore = -Infinity;
  let move = null;

  boxes.forEach((box, index) => {
    if (box.innerHTML === "") {
      box.innerHTML = "O";
      let score = minimax(false);
      box.innerHTML = "";
      if (score > bestScore) {
        bestScore = score;
        move = index;
      }
    }
  });
  return move;
}

function minimax(isMaximizing) {
  if (checkForWinner("O")) return 10;
  if (checkForWinner("X")) return -10;
  if (Array.from(boxes).every((box) => box.innerHTML !== "")) return 0;

  let scores = [];

  boxes.forEach((box, index) => {
    if (box.innerHTML === "") {
      box.innerHTML = isMaximizing ? "O" : "X";
      scores.push(minimax(!isMaximizing));
      box.innerHTML = "";
    }
  });

  return isMaximizing ? Math.max(...scores) : Math.min(...scores);
}

function checkForWinner(player) {
  const winConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  return winConditions.some((condition) => {
    const [a, b, c] = condition;
    return boxes[a].innerHTML === player &&
           boxes[b].innerHTML === player &&
           boxes[c].innerHTML === player;
  });
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
