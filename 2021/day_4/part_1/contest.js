fs = require("fs");
fs.readFile("./2021/day_4/input.txt", 'utf8', (err, input) => {
    const numbers = input.split('\r\n').shift().split(',').map(Number);
    const boards = [];
    const regex = /\s*(?<number>\d+)/g;
    
    let currentBoard = getNewBoard();
    let y = 0;
    input.split('\r\n').slice(2).forEach(line => {
        if (line.length == 0) {
            boards.push(currentBoard);
            currentBoard = getNewBoard();
            y = 0;
        } else {
            const row = [];
            let match = regex.exec(line);
            let x = 0;
            while (match != null) {
                const number = Number(match.groups.number);
                row.push({number});
                currentBoard.numbers.set(number, {x, y});
                match = regex.exec(line);
                x++;
            }
            currentBoard.grid.push(row);
            y++;
        }
    });

    // part1(boards, numbers);
    part2(boards, numbers);
});

const part1 = (boards, numbers) => {
    for (const number of numbers) {
        for (const board of boards) {
            const position = checkNumber(board, number);
            const bingo = position && checkBingo(board, position);

            if (bingo) {
                const score = number *  board.grid.reduce(
                    (acc1, row) => acc1 + row.reduce(
                        (acc2, cell) => acc2 + (cell.checked ? 0 : cell.number),
                        0),
                    0);
                console.log(score);
                return;
            }
        }
    }
};

const part2 = (boards, numbers) => {
    let lastScore = null;
    for (const number of numbers) {
        for (const board of boards) {
            if (board.won) continue;
            const position = checkNumber(board, number);
            const bingo = position && checkBingo(board, position);

            if (bingo) {
                lastScore = number *  board.grid.reduce(
                    (acc1, row) => acc1 + row.reduce(
                        (acc2, cell) => acc2 + (cell.checked ? 0 : cell.number),
                        0),
                    0);
            }
        }
    }
    console.log(lastScore);
    return;
};

const getNewBoard = () => ({grid: [], numbers: new Map()});

const checkNumber = (board, number) => {
    if (board.numbers.has(number)) {
        const {x, y} = board.numbers.get(number);
        board.grid[y][x].checked = true;
        return {x, y};
    }

    return null;
}

const checkRowBingo = (board, y) => {
    for (let x = 0; x < board.grid[0].length; x++) {
        if (!board.grid[y][x].checked) return false;
    }
    board.won = true;
    return true;
}

const checkColumnBingo = (board, x) => {
    for (let y = 0; y < board.grid.length; y++) {
        if (!board.grid[y][x].checked) return false;
    }
    board.won = true;
    return true;
}

const checkBingo = (board, {x, y}) => checkRowBingo(board, y) || checkColumnBingo(board, x);