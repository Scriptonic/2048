document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('game-board');
    const restartBtn = document.getElementById('restart-btn');
    const restartBtnModal = document.getElementById('restart-btn-modal');
    const modalBody = document.getElementById('modal-body');
    const gameModal = new bootstrap.Modal(document.getElementById('gameModal'));
    let board;
    
    function createBoard() {
        board = new Array(4).fill(null).map(() => new Array(4).fill(null));
        addNewTile();
        addNewTile();
        renderBoard();
    }

    function addNewTile() {
        let emptyTiles = [];
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                if (board[r][c] === null) {
                    emptyTiles.push({ row: r, col: c });
                }
            }
        }
        if (emptyTiles.length > 0) {
            let { row, col } = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
            board[row][col] = Math.random() > 0.1 ? 2 : 4;
        }
    }

    function renderBoard() {
        gameBoard.innerHTML = '';
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                let tileValue = board[r][c];
                let tile = document.createElement('div');
                tile.classList.add('tile', 'd-flex', 'justify-content-center', 'align-items-center');
                if (tileValue) {
                    tile.classList.add(`tile-${tileValue}`);
                    tile.textContent = tileValue;
                }
                gameBoard.appendChild(tile);
            }
        }
    }

    function moveTiles(direction) {
        let moved = false;
        for (let i = 0; i < 4; i++) {
            let row;
            switch (direction) {
                case 'left':
                    row = board[i].filter(tile => tile);
                    while (row.length < 4) row.push(null);
                    if (row.toString() !== board[i].toString()) moved = true;
                    board[i] = row;
                    break;
                case 'right':
                    row = board[i].filter(tile => tile);
                    while (row.length < 4) row.unshift(null);
                    if (row.toString() !== board[i].toString()) moved = true;
                    board[i] = row;
                    break;
                case 'up':
                    row = [];
                    for (let j = 0; j < 4; j++) {
                        if (board[j][i]) row.push(board[j][i]);
                    }
                    while (row.length < 4) row.push(null);
                    for (let j = 0; j < 4; j++) {
                        if (board[j][i] !== row[j]) moved = true;
                        board[j][i] = row[j];
                    }
                    break;
                case 'down':
                    row = [];
                    for (let j = 0; j < 4; j++) {
                        if (board[j][i]) row.push(board[j][i]);
                    }
                    while (row.length < 4) row.unshift(null);
                    for (let j = 0; j < 4; j++) {
                        if (board[j][i] !== row[j]) moved = true;
                        board[j][i] = row[j];
                    }
                    break;
            }
        }
        if (moved) addNewTile();
        renderBoard();
        checkGameOver();
    }

    function mergeTiles(direction) {
        let merged = false;
        switch (direction) {
            case 'left':
                for (let r = 0; r < 4; r++) {
                    for (let c = 0; c < 3; c++) {
                        if (board[r][c] && board[r][c] === board[r][c + 1]) {
                            board[r][c] *= 2;
                            board[r][c + 1] = null;
                            merged = true;
                        }
                    }
                }
                break;
            case 'right':
                for (let r = 0; r < 4; r++) {
                    for (let c = 3; c > 0; c--) {
                        if (board[r][c] && board[r][c] === board[r][c - 1]) {
                            board[r][c] *= 2;
                            board[r][c - 1] = null;
                            merged = true;
                        }
                    }
                }
                break;
            case 'up':
                for (let c = 0; c < 4; c++) {
                    for (let r = 0; r < 3; r++) {
                        if (board[r][c] && board[r][c] === board[r + 1][c]) {
                            board[r][c] *= 2;
                            board[r + 1][c] = null;
                            merged = true;
                        }
                    }
                }
                break;
            case 'down':
                for (let c = 0; c < 4; c++) {
                    for (let r = 3; r > 0; r--) {
                        if (board[r][c] && board[r][c] === board[r - 1][c]) {
                            board[r][c] *= 2;
                            board[r - 1][c] = null;
                            merged = true;
                        }
                    }
                }
                break;
        }
        if (merged) {
            moveTiles(direction);
            addNewTile();
            checkGameOver();
        }
    }

    function checkGameOver() {
        if (checkWin()) {
            modalBody.textContent = 'Congratulations! You reached 2042!';
            gameModal.show();
        } else if (noAvailableMoves()) {
            modalBody.textContent = 'Game Over! No more available moves.';
            gameModal.show();
        }
    }

    function checkWin() {
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                if (board[r][c] === 2048) {
                    return true;
                }
            }
        }
        return false;
    }

    function noAvailableMoves() {
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                if (board[r][c] === null) return false;
                if (c < 3 && board[r][c] === board[r][c + 1]) return false;
                if (r < 3 && board[r][c] === board[r + 1][c]) return false;
            }
        }
        return true;
    }

    document.addEventListener('keydown', (e) => {
        switch (e.key) {
            case 'ArrowLeft':
                moveTiles('left');
                mergeTiles('left');
                break;
            case 'ArrowRight':
                moveTiles('right');
                mergeTiles('right');
                break;
            case 'ArrowUp':
                moveTiles('up');
                mergeTiles('up');
                break;
            case 'ArrowDown':
                moveTiles('down');
                mergeTiles('down');
                break;
        }
    });

    restartBtn.addEventListener('click', createBoard);
    restartBtnModal.addEventListener('click', createBoard);

    createBoard();
});
