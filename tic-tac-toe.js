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
    winningCombinations = [
        [this.board.cells[0], this.board.cells[1], this.board.cells[2]],
        [this.board.cells[3], this.board.cells[4], this.board.cells[5]],
        [this.board.cells[6], this.board.cells[7], this.board.cells[8]],
        [this.board.cells[0], this.board.cells[3], this.board.cells[6]],
        [this.board.cells[1], this.board.cells[4], this.board.cells[7]],
        [this.board.cells[2], this.board.cells[5], this.board.cells[8]],
        [this.board.cells[0], this.board.cells[4], this.board.cells[8]],
        [this.board.cells[2], this.board.cells[4], this.board.cells[6]]
    ];

    getActualPlayer() {
        return this.players[this.round % this.players.length];
    };

    nextRound(cell) {
        const actualPlayer = this.getActualPlayer();
        const cellPlay = cell || this.selectCell(actualPlayer);
        console.log('cellPlay', cellPlay);
        cellPlay.value = actualPlayer.symbol;
        this.board.draw(this.players);
        this.checkVictory(actualPlayer);
        this.round++;
    };

    cellIsAvailable(cell) {
        return cell.value === null;
    };

    /** FUNCTION TO BE IMPLEMENTED */
    selectCell() {
        /**** the parameters ****/
        this.board.cells; // list of cell
        this.players; // list of player
        this.getActualPlayer(); // the current player

        /**** return cell *******/
        // Met random sur les 2 premiers tours
        if (this.round < 2) {
            const availableCells = this.board.cells.filter(cell => cell.value === null);
            return availableCells[Math.floor(Math.random() * Math.floor(availableCells.length))];
        }

        // Met un poid sur chaque combinaisons
        // 3        =   3 pos win                               x
        // 2        =   2 pos win et 1 libre
        // 1        =   1 pos win et 2 libres
        // -8       =   1 pos enemy et 2 pos win                x
        // -9       =   1 pos enemy, 1 pos win et 1 libre
        // -10      =   1 pos enemy et 2 libre
        // -19      =   2 pos enemy et 1 pos win                x
        // -20      =   2 pos enemy et 1 libre
        // -30      =   3 pos enemy                             x
        const combinations = this.winningCombinations.map(winningCombination => {
            let weight = 0;
            winningCombination.forEach(cell => {
                if (cell.value !== null) {
                    weight += (cell.value === this.getActualPlayer().symbol ? 1 : -10);
                }
            });
            return {weight: weight, winningCombination: winningCombination}
        });

        // Regarde les combinaisons encore possible (une case de libre au minimum)
        const availableCombinations = combinations.filter(enemyCombination => ![3, -8, -19, -30].includes(enemyCombination.weight));

        // Si il y a une possibilité de gagner avec 2 win et 1 libre
        const winCombinationPonderous = availableCombinations.find(enemyCombination => enemyCombination.weight === 2);
        if (winCombinationPonderous !== undefined) {
            return winCombinationPonderous.winningCombination.find(cell => cell.value === null);
        }

        // Si il y a un risque 2 enemy et 1 libre
        const enemyCombinations = availableCombinations.find(enemyCombination => enemyCombination.weight === -20);
        if (enemyCombinations !== undefined) {
            return enemyCombinations.winningCombination.find(cell => cell.value === null);
        }

        // Si il y a deux cases libre et 1 case win
        let nextCombination = availableCombinations.find(enemyCombination => enemyCombination.weight === 1);
        if (nextCombination !== undefined) {
            return nextCombination.winningCombination.find(cell => cell.value === null);
        }

        // Si il y a deux cases libre et 1 case win
        nextCombination = availableCombinations.find(enemyCombination => enemyCombination.weight === -10);
        if (nextCombination !== undefined) {
            return nextCombination.winningCombination.find(cell => cell.value === null);
        }

        // sinon au hasard
        if (this.round < 2) {
            const availableCells = this.board.cells.filter(cell => cell.value === null);
            return availableCells[Math.floor(Math.random() * Math.floor(availableCells.length))];
        }
    };

    checkVictory(actualPlayer) {
        this.winningCombinations.forEach(winningCombination => {
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

/**
 * Start-up function
 */
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