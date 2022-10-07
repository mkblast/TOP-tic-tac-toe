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

const gameBoard = (function() {
  const _gameBoardLayout = ['', '', '', '', '', '', '', '', ''];
  let _playedTiles = [];
  let gameTurn = 0

  const _refreshBoard = () => {
    const board = document.querySelector('.board');
    board.innerHTML = '';
    for (let i = 0; i < 9; i++) {
      const tile = document.createElement('div');
      tile.classList.add('tile');
      if ((_playedTiles.find(num => num == i)) != i) {
        tile.classList.add('empty');
      }
      board.appendChild(tile);
    }
  }

  const _renderTiles = () => {
    const gameTiles = document.querySelectorAll('.tile');
    for (let i = 0; i < gameTiles.length; i++) {
      gameTiles[i].textContent = _gameBoardLayout[i];
    }
  }

  const tileMark = (index, mark) => {
    _gameBoardLayout[index] = mark;
    _playedTiles.push(index);
    _refreshBoard();
    _renderTiles();
    gameTurn++;
    _checkGame()
  }

  const addPlayers = (function() {
    const xPlayer = player(prompt('name:'), 'X');
    const oPlayer = player(prompt('name:'), 'O');
    return { xPlayer, oPlayer }
  })()

  const startGame = () => {
    addPlayers.xPlayer.startListen()
  }

  const _changeTurn = () => {
    (gameTurn % 2 == 0) ? (addPlayers.xPlayer.startListen()) : (addPlayers.oPlayer.startListen())
  }

  const _checkGame = () => {
    if (_playedTiles.length == 9){
      alert("you won")
    } else {
      _changeTurn()
    }
  }

  return { tileMark, startGame};
})()

gameBoard.startGame()
