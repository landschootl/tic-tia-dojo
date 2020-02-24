/**
 * Class that represents a player
 */
class Player {
    constructor(name, symbol, color, isComputer) {
        this.name = name;
        this.symbol = symbol;
        this.color = color;
        this.isComputer = isComputer;
    }
}

/**
 * Class that represents a game board
 */
class Board {
    cells = [
        new Cell(0, 0), new Cell(0, 1), new Cell(0, 2),
        new Cell(1, 0), new Cell(1, 1), new Cell(1, 2),
        new Cell(2, 0), new Cell(2, 1), new Cell(2, 2)
    ];

    getCell(posX, posY) {
        return this.cells.find(cell => cell.posX === posX && cell.posY === posY);
    }

    draw(players) {
        this.cells.forEach(cell => {
            const btn = document.getElementById(`cell-${cell.posX}-${cell.posY}`);
            btn.innerHTML = cell.value;
            if (cell.value !== null) {
                btn.style.color = players.find(player => player.symbol === cell.value).color;
            }

        });
    }
}

/**
 * Class that represents a cell of game board
 */
class Cell {
    constructor(posX, posY) {
        this.posX = posX;
        this.posY = posY;
        this.value = null;
    }
}

/**
 * Class that represents a game
 */
class Game {
    round = 0;
    players = [
        new Player('player 1', 'X', '#ffcc5c', false),
        new Player('player 2', 'O', '#ff6f69', true)
    ];
    board = new Board();
    isFinish = false;

    getActualPlayer() {
        return this.players[this.round % this.players.length];
    };

    nextRound(cell) {
        const actualPlayer = this.getActualPlayer();
        const cellPlay = cell || this.selectCell();
        cellPlay.value = actualPlayer.symbol;
        this.board.draw(this.players);
        this.checkVictory(actualPlayer);
        this.round++;
    };

    cellIsAvailable(cell) {
        return cell.value === null;
    };

    selectCell() {
        /** TO IMPLEMENT */
        const availableCells = this.board.cells.filter(cell => cell.value === null);
        return availableCells[Math.floor(Math.random() * Math.floor(availableCells.length))];
    };

    checkVictory(actualPlayer) {
        [
            [this.board.cells[0], this.board.cells[1], this.board.cells[2]],
            [this.board.cells[3], this.board.cells[4], this.board.cells[5]],
            [this.board.cells[6], this.board.cells[7], this.board.cells[8]],
            [this.board.cells[0], this.board.cells[3], this.board.cells[6]],
            [this.board.cells[1], this.board.cells[4], this.board.cells[7]],
            [this.board.cells[2], this.board.cells[5], this.board.cells[8]],
            [this.board.cells[0], this.board.cells[4], this.board.cells[8]],
            [this.board.cells[2], this.board.cells[4], this.board.cells[6]]
        ].forEach(winningCombination => {
            if (winningCombination.filter(cell => cell.value === actualPlayer.symbol).length === 3) {
                this.isFinish = true;
                winningCombination.forEach(cell => document.getElementById(`cell-${cell.posX}-${cell.posY}`).style.backgroundColor = '#00D68F');
                document.getElementById('result').innerHTML = `${actualPlayer.name} won !`;
            }
        });

        if (!this.isFinish && this.round === 8) {
            this.isFinish = true;
            document.getElementById('result').innerHTML = `No winner..`;
        }
    };
}

function main() {
    const game = new Game();
    const startGameBtn = document.getElementById('start-game-btn');

    startGameBtn.addEventListener('click', () => {
        startGameBtn.hidden = true;
        game.players = [game.players[1], game.players[0]];
        game.nextRound();
    });

    document.querySelectorAll("#board button").forEach(button => button.addEventListener('click', function () {
        startGameBtn.hidden = true;
        const posCell = this.getAttribute('id').split('-');
        const checkCell = game.board.getCell(parseInt(posCell[1]), parseInt(posCell[2]));
        if (!game.isFinish && game.cellIsAvailable(checkCell) && !game.getActualPlayer().isComputer) {
            game.nextRound(checkCell);
            if (!game.isFinish) {
                setTimeout(() => game.nextRound(), 500);
            }
        }
    }));
}

main();
