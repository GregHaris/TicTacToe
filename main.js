// Gameboard Module
const Gameboard = (() => {
  let board = Array(9).fill(null);

  const getBoard = () => board;

  const setMark = (index, mark) => {
    if (board[index] === null) {
      board[index] = mark;
      return true;
    }
    return false;
  };

  const resetBoard = () => {
    board = Array(9).fill(null);
  };

  return { getBoard, setMark, resetBoard };
})();

// Player Factory
const createPlayer = (name, mark) => {
  return { name, mark };
};

// Display Controller Module
const DisplayController = (() => {
  const cellElements = document.querySelectorAll("[data-cell]");
  const gameBoardElement = document.querySelector("#gameBoard");
  const winningMessageTextElement = document.querySelector("[data-winning-message-text]");
  const winningMessageElement = document.querySelector("#winningMessage");
  const restartButton = document.querySelector("#restartButton");
  const setupElement = document.querySelector("#setup");
  const player1NameInput = document.querySelector("#player1Name");
  const player2NameInput = document.querySelector("#player2Name");
  const startButton = document.querySelector("#startButton");

  const renderBoard = () => {
    const board = Gameboard.getBoard();
    cellElements.forEach((cell, index) => {
      cell.classList.remove("x", "circle");
      if (board[index] === "x") {
        cell.classList.add("x");
      } else if (board[index] === "circle") {
        cell.classList.add("circle");
      }
    });
  };

  const handleCellClick = (e) => {
    const index = e.target.dataset.cell;
    if (Gameboard.setMark(index, GameController.getCurrentPlayer().mark)) {
      renderBoard();
      if (GameController.checkWin()) {
        endGame(false);
      } else if (GameController.checkDraw()) {
        endGame(true);
      } else {
        GameController.switchPlayer();
        setHoverClass();
      }
    }
  };

  const endGame = (draw) => {
    if (draw) {
      winningMessageTextElement.textContent = "It's a draw!";
    } else {
      winningMessageTextElement.textContent = `${GameController.getCurrentPlayer().name} wins!`;
    }
    winningMessageElement.classList.add("show");
  };

  const startGame = () => {
    const player1Name = player1NameInput.value || "Player 1";
    const player2Name = player2NameInput.value || "Player 2";
    GameController.setPlayers(player1Name, player2Name);
    Gameboard.resetBoard();
    GameController.startGame();
    renderBoard();
    winningMessageElement.classList.remove("show");
    cellElements.forEach((cell) => {
      cell.addEventListener("click", handleCellClick, { once: true });
      cell.classList.remove("x", "circle");
    });
    setHoverClass();
    setupElement.style.display = "none";
    gameBoardElement.style.display = "grid";
  };

  const setHoverClass = () => {
    gameBoardElement.classList.remove("x", "circle");
    if (GameController.getCurrentPlayer().mark === "x") {
      gameBoardElement.classList.add("x");
    } else {
      gameBoardElement.classList.add("circle");
    }
  };

  restartButton.addEventListener("click", () => {
    setupElement.style.display = "flex";
    gameBoardElement.style.display = "none";
    winningMessageElement.classList.remove("show");
  });

  startButton.addEventListener("click", startGame);

  return { startGame };
})();

// Game Controller Module
const GameController = (() => {
  let players = [];
  let currentPlayerIndex = 0;

  const setPlayers = (player1Name, player2Name) => {
    players = [createPlayer(player1Name, "x"), createPlayer(player2Name, "circle")];
  };

  const getCurrentPlayer = () => players[currentPlayerIndex];

  const switchPlayer = () => {
    currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
  };

  const checkWin = () => {
    const board = Gameboard.getBoard();
    const currentMark = getCurrentPlayer().mark;
    const winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    return winningCombinations.some((combination) => {
      return combination.every((index) => board[index] === currentMark);
    });
  };

  const checkDraw = () => {
    return Gameboard.getBoard().every((cell) => cell !== null);
  };

  const startGame = () => {
    currentPlayerIndex = 0;
  };

  return { setPlayers, getCurrentPlayer, switchPlayer, checkWin, checkDraw, startGame };
})();