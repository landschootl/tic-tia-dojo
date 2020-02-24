function Player(name, symbol) {
    this.name = name;
    this.symbol = symbol;
}

function Cell(posX, posY) {
    this.posX = posX;
    this.posY = posY;
    this.value = null;
}

function Game() {
    this.round = 0;
    this.players = [
        new Player('player 1', 'X'),
        new Player('player 2', 'O')
    ];
    this.board = [
        new Cell(0, 0), new Cell(0, 1), new Cell(0, 2),
        new Cell(1, 0), new Cell(1, 1), new Cell(1, 2),
        new Cell(2, 0), new Cell(2, 1), new Cell(2, 2)
    ];
    this.isFinish = false;

    this.drawBoard = () => {
        this.board.forEach(cell => document.getElementById(`cell-${cell.posX}-${cell.posY}`).innerHTML = cell.value);
    };

    this.nextRound = () => {
        const actualPlayer = this.players[this.round % this.players.length];
        const cellPlay = this.selectCell();
        cellPlay.value = actualPlayer.symbol;
        this.drawBoard();
        this.checkVictory(actualPlayer);
        this.round++;
    };

    this.selectCell = () => {
        const availableCells = this.board
            .filter(cell => cell.value === null);

        return availableCells[Math.floor(Math.random() * Math.floor(availableCells.length))];
    };

    this.checkVictory = (actualPlayer) => {
        [
            [this.board[0], this.board[1], this.board[2]],
            [this.board[3], this.board[4], this.board[5]],
            [this.board[6], this.board[7], this.board[8]],
            [this.board[0], this.board[3], this.board[6]],
            [this.board[1], this.board[4], this.board[7]],
            [this.board[2], this.board[5], this.board[8]],
            [this.board[0], this.board[4], this.board[8]],
            [this.board[2], this.board[4], this.board[6]]
        ].forEach(winningCombination => {
            if(winningCombination.filter(cell => cell.value === actualPlayer.symbol).length === 3) {
                this.isFinish = true;
                winningCombination.forEach(cell => document.getElementById(`cell-${cell.posX}-${cell.posY}`).style.backgroundColor = '#5CB85C');
                document.getElementById('result').innerHTML = `${actualPlayer.name} won`;
            }
        });

        if(!this.isFinish && this.round === 8) {
            document.getElementById('result').innerHTML = `No winner`;
        }
    };
}

function main() {
    const startGameBtn = document.getElementById('start-game-btn');
    startGameBtn.addEventListener('click', () => {
        startGameBtn.disabled = true;
        const game = new Game();
        const interval = setInterval(() => {
            if (game.isFinish || game.round > 8) {
                this.clearInterval(interval);
                return;
            }
            game.nextRound();
        }, 500);
    });
}
main();
