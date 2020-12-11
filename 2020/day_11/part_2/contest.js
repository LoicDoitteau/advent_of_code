const { count } = require("console");

fs = require("fs");
fs.readFile("./2020/day_11/input.txt", 'utf8', (err, input) => {

    const cells = {
        floor: '.',
        empty: 'L',
        occupied: '#'

    };
    
    let grid = input.split("\r\n").map(line => line.split(''));

    const gridHeight = grid => grid.length;
    const gridWidth = grid => grid[0].length;

    const hash = grid => grid.map(row => row.join('')).join('');

    const evolve = grid => grid.map((row, y) => row.map((cell, x) => {
        const occupied = countAdjOccupied(grid, x, y);
        if (cell == cells.empty && !occupied) return cells.occupied;
        if (cell == cells.occupied && occupied >= 5) return cells.empty;
        return cell;
    }));


    const countAdjOccupied = (grid, x, y) => {
        const height = gridHeight(grid);
        const width = gridWidth(grid);

        let count = 0;
        const dirs = [
            { dx: -1, dy: 0 },
            { dx: -1, dy: -1 },
            { dx: -1, dy: 1 },
            { dx: 1, dy: 0 },
            { dx: 1, dy: -1 },
            { dx: 1, dy: 1 },
            { dx: 0, dy: -1 },
            { dx: 0, dy: 1 },
        ];

        for (const dir of dirs) {
            let stop = false;
            let newX = x + dir.dx;
            let newY = y + dir.dy;
            while (newX >= 0 && newX < width && newY >= 0 && newY < height) {
                if (grid[newY][newX] == cells.occupied) count++;
                if (grid[newY][newX] != cells.floor) stop = true;
                if (stop) break;
                newX += dir.dx;
                newY += dir.dy;
            }
        }
        return count;
    }

    while (true) {
        const hashGrid = hash(grid);
        const newGrid = evolve(grid);
        const hashNewGrid = hash(newGrid);
        grid = newGrid;

        if (hashGrid == hashNewGrid) break;
    }

    const response = grid.reduce((acc, row) => acc + row.filter(cell => cell == cells.occupied).length, 0);
    console.log(response);
});
