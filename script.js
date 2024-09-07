const gameBoard = document.getElementById('game-board');
const scoreElement = document.querySelector('#score .score-value');
const bestScoreElement = document.querySelector('#best-score .score-value');
const restartButton = document.querySelector('.restart-button');
let board = [];
let score = 0;
let bestScore = 0;

function initGame() {
    board = Array(4).fill().map(() => Array(4).fill(0));
    score = 0;
    updateScore();
    addNewTile();
    addNewTile();
    renderBoard();
}

function addNewTile() {
    const emptyTiles = [];
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (board[i][j] === 0) {
                emptyTiles.push({i, j});
            }
        }
    }
    if (emptyTiles.length > 0) {
        const {i, j} = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
        board[i][j] = Math.random() < 0.9 ? 2 : 4;
    }
}

function renderBoard() {
    gameBoard.innerHTML = '';
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            const tile = document.createElement('div');
            tile.className = `tile ${board[i][j] ? 'tile-' + board[i][j] : ''}`;
            if (board[i][j]) {
                const emoji = getEmoji(board[i][j]);
                tile.textContent = `${board[i][j]} ${emoji}`;
            }
            gameBoard.appendChild(tile);
        }
    }
}

function getEmoji(value) {
    const emojis = {
        2: '🙈',
        4: '🙉',
        8: '🙊',
        16: '🦊',
        32: '🦍',
        64: '🦁',
        128: '🐵',
        256: '🦝',
        512: '🦧',
        1024: '🦓',
        2048: '🦄'
    };
    return emojis[value] || '';
}

function updateScore() {
    scoreElement.textContent = score;
    if (score > bestScore) {
        bestScore = score;
        bestScoreElement.textContent = bestScore;
    }
}

function move(direction) {
    let moved = false;
    const newBoard = JSON.parse(JSON.stringify(board));

    function moveAndMerge(line) {
        // 移除零
        let newLine = line.filter(tile => tile !== 0);
        
        // 合并相同的数字
        for (let i = 0; i < newLine.length - 1; i++) {
            if (newLine[i] === newLine[i + 1]) {
                newLine[i] *= 2;
                score += newLine[i];
                newLine.splice(i + 1, 1);
                moved = true;
            }
        }
        
        // 填充零
        while (newLine.length < 4) {
            newLine.push(0);
        }
        
        return newLine;
    }

    // 对每一行/列应用移动和合并
    for (let i = 0; i < 4; i++) {
        let line;
        
        switch(direction) {
            case 'left':
                line = moveAndMerge(newBoard[i]);
                if (line.some((val, index) => val !== newBoard[i][index])) moved = true;
                newBoard[i] = line;
                break;
            case 'right':
                line = moveAndMerge(newBoard[i].reverse()).reverse();
                if (line.some((val, index) => val !== newBoard[i][index])) moved = true;
                newBoard[i] = line;
                break;
            case 'up':
                line = moveAndMerge([newBoard[0][i], newBoard[1][i], newBoard[2][i], newBoard[3][i]]);
                for (let j = 0; j < 4; j++) {
                    if (newBoard[j][i] !== line[j]) {
                        moved = true;
                        newBoard[j][i] = line[j];
                    }
                }
                break;
            case 'down':
                line = moveAndMerge([newBoard[3][i], newBoard[2][i], newBoard[1][i], newBoard[0][i]]).reverse();
                for (let j = 0; j < 4; j++) {
                    if (newBoard[j][i] !== line[j]) {
                        moved = true;
                        newBoard[j][i] = line[j];
                    }
                }
                break;
        }
    }

    if (moved) {
        board = newBoard;
        addNewTile();
        renderBoard();
        updateScore();
    }
}

document.addEventListener('keydown', (e) => {
    switch(e.key) {
        case 'ArrowUp': move('up'); break;
        case 'ArrowDown': move('down'); break;
        case 'ArrowLeft': move('left'); break;
        case 'ArrowRight': move('right'); break;
    }
});

let startX, startY;

gameBoard.addEventListener('mousedown', (e) => {
    startX = e.clientX;
    startY = e.clientY;
});

gameBoard.addEventListener('mouseup', (e) => {
    const endX = e.clientX;
    const endY = e.clientY;
    const diffX = endX - startX;
    const diffY = endY - startY;

    if (Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 0) {
            move('right');
        } else {
            move('left');
        }
    } else {
        if (diffY > 0) {
            move('down');
        } else {
            move('up');
        }
    }
});

restartButton.addEventListener('click', initGame);

initGame();