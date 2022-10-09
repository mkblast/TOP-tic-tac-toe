const gameBoard = (function() {

  let gameBoardLayout = ['', '', '', '', '', '', '', '', ''];
  let playedTiles = [];
  let gameTurn = 0;
  let xPlayer;
  let oPlayer;
  let ai;

  const startGame = () => {
    gameBoardLayout = ['', '', '', '', '', '', '', '', ''];
    playedTiles = [];
    gameTurn = 0;
    _refreshBoard();

    _addPlayers(gameBoard.ai);
    xPlayer.startListen();
  }

  const _addPlayers = (ai) => {
    xPlayer = player(prompt('name:'), 'X');

    if (ai) {
      oPlayer = {
        name: 'AI',
        mark: 'O'
      }
    } else {
      oPlayer = player(prompt('name:'), 'O');
    }
  }

  const tileMark = (index, mark) => {
    gameBoardLayout[index] = mark;
    playedTiles.push(index);
    _updateGame();
  }

  const aiTileMark = () => {
    const tile = document.querySelectorAll('.tile');
    const indexes = [];
    for (let i = 0; i < gameBoardLayout.length; i++) {
      if (gameBoardLayout[i] == '') {
        indexes.push(i);
      }
    }

    const random = Math.floor(Math.random() * indexes.length);
    tile[indexes[random]].textContent = oPlayer.mark;
    gameBoardLayout[indexes[random]] = oPlayer.mark;

    _updateGame();
  }

  const _updateGame = () => {
    _refreshBoard();
    _renderTiles();
    gameTurn++;
    setTimeout(_checkGame, 500)
  }

  const _refreshBoard = () => {
    const board = document.querySelector('.board');
    board.innerHTML = '';
    for (let i = 0; i < 9; i++) {
      const tile = document.createElement('div');
      tile.classList.add('tile');
      if ((playedTiles.find(num => num == i)) != i) {
        tile.classList.add('empty');
      }
      board.appendChild(tile);
    }
  }

  const _renderTiles = () => {
    const gameTiles = document.querySelectorAll('.tile');
    for (let i = 0; i < gameTiles.length; i++) {
      gameTiles[i].textContent = gameBoardLayout[i];
    }
  }

  const _checkGame = () => {
    if (_checkLayout(xPlayer.mark)) {
      return gameDisplay.showResault(xPlayer.name);
    } else if (_checkLayout(oPlayer.mark)) {
      return gameDisplay.showResault(oPlayer.name);
    } else if (playedTiles.length == 9) {
      return gameDisplay.showResault();
    }

    return _changeTurn()
  }

  const _checkLayout = (mark) => {
    const winConditions = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ]
    const indexes = [];
    for (let i = 0; i < gameBoardLayout.length; i++) {
      if (gameBoardLayout[i] == mark) {
        indexes.push(i);
      }
    }

    if (indexes.length != 0) {
      for (let i = 0; i < winConditions.length; i++) {
        for (let j = 0; j < winConditions[i].length; j++) {
          for (let k = 0; k < indexes.length; k++) {
            if (winConditions[i][j] == indexes[k]) {
              winConditions[i].splice(j, 1);
            }
          }
        }
      }
    }

    for (let i = 0; i < winConditions.length; i++) {
      if (winConditions[i].length == 0) {
        return true;
      }
    }
  }

  const _changeTurn = () => {
    if (gameBoard.ai) {
      (gameTurn % 2 == 0) ? (xPlayer.startListen()) : (aiTileMark());
    } else {
      (gameTurn % 2 == 0) ? (xPlayer.startListen()) : (oPlayer.startListen());
    }
  }

  const restartGame = () => {
    gameBoardLayout = ['', '', '', '', '', '', '', '', ''];
    playedTiles = [];
    gameTurn = 0;
    _refreshBoard();
    startGame();
  }


  return { tileMark, startGame, restartGame, ai };
})()

const gameDisplay = (function() {

  const playerButton = document.querySelector('.start-player');
  const aiButton = document.querySelector('.start-ai');
  const resaultDiv = document.querySelector('.resault');

  const showResault = (player) => {
    if (player) {
      const resaultDiv = document.querySelector('.resault');
      return resaultDiv.textContent = `${player} Wins`
    }
    return resaultDiv.textContent = 'It\'s a Draw'
  }

  const updateDisplay = (mode) => {
    if (mode) {
      aiButton.textContent = 'Player vs AI';
      resaultDiv.textContent = ''
    } else {
      playerButton.textContent = 'Player vs Player';
      resaultDiv.textContent = ''
    }
  }


  playerButton.addEventListener('click', (e) => {
    if (e.target.textContent == 'Player vs Player') {
      gameBoard.ai = false;
      gameBoard.startGame();
      e.target.textContent = 'Restart Game';
      updateDisplay(true)
    } else {
      updateDisplay(true)
      gameBoard.restartGame();
    }
  })

  aiButton.addEventListener('click', (e) => {
    if (e.target.textContent == 'Player vs AI') {
      gameBoard.ai = true;
      gameBoard.startGame();
      e.target.textContent = 'Restart Game';
      updateDisplay(false)
    } else {
      updateDisplay(false)
      gameBoard.restartGame();
    }
  })

  return { showResault }

})()

const player = function(name, mark) {

  const startListen = () => {
    const gameTiles = document.querySelectorAll('.tile');
    for (let i = 0; i < gameTiles.length; i++) {
      if (gameTiles[i].className == 'tile empty') {
        gameTiles[i].addEventListener('click', () => { gameBoard.tileMark(i, mark, false) });
      }
    }
  }

  return { name, mark, startListen };
}
