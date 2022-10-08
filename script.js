const gameBoard = (function() {

  let gameBoardLayout = ['', '', '', '', '', '', '', '', ''];
  let playedTiles = [];
  let gameTurn = 0;
  let xPlayer;
  let oPlayer;

  const startGame = () => {
    _addPlayers();
    xPlayer.startListen();
  }

  const _addPlayers = () => {
    xPlayer = player(prompt('name:'), 'X');
    oPlayer = player(prompt('name:'), 'O');
  }

  const tileMark = (index, mark) => {
    gameBoardLayout[index] = mark;
    playedTiles.push(index);
    _updateGame()
  }

  const _updateGame = () => {
    _refreshBoard();
    _renderTiles();
    gameTurn++;
    _checkGame()
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
      return alert(`${xPlayer.name} Win`)
    } else if (_checkLayout(oPlayer.mark)) {
      return alert(`${oPlayer.name} Win`)
    } else if (playedTiles.length == 9) {
      return alert('Draw')
    }
    return _changeTurn();
  }

  const _checkLayout = (mark) => {
    const winConditions = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 6],
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
    (gameTurn % 2 == 0) ? (xPlayer.startListen()) : (oPlayer.startListen());
  }

  const restartGame = () => {
    gameBoardLayout = ['', '', '', '', '', '', '', '', ''];
    playedTiles = [];
    gameTurn = 0;
    _refreshBoard()
    startGame()
  }

  return { tileMark, startGame, restartGame };
})()

const gameDisplay = (function() {

  const startButton = document.querySelector('.start')
  startButton.addEventListener('click', (e) => {
    if (e.target.textContent == 'Start game') {
      gameBoard.startGame()
      e.target.textContent = 'Restart game'
    } else {
      gameBoard.restartGame()
    }
  })

})()

const player = function(name, mark) {

  const startListen = () => {
    const gameTiles = document.querySelectorAll('.tile');
    for (let i = 0; i < gameTiles.length; i++) {
      if (gameTiles[i].className == 'tile empty') {
        gameTiles[i].addEventListener('click', () => { gameBoard.tileMark(i, mark) });
      }
    }
  }

  return { name, mark, startListen };
}
