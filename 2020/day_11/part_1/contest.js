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
    const gridWidth = grid => grid[0].height;

    const hash = grid => grid.map(row => row.join('')).join('');

    const evolve = grid => grid.map((row, y) => row.map((cell, x) => {
        const occupied = countAdjOccupied(grid, x, y);
        if (cell == cells.empty && !occupied) return cells.occupied;
        if (cell == cells.occupied && occupied >= 4) return cells.empty;
        return cell;
    }));


    const countAdjOccupied = (grid, x, y) => {
        const height = gridHeight(grid);
        const width = gridWidth(grid);

        let count = 0;
        for (let dx = -1; dx <= 1; dx++) {
            const newX = x + dx;
            if (newX < 0 || newX >= width) continue;
            for (let dy = -1; dy <= 1; dy++) {
                const newY = y + dy;
                if (dx == 0 && dy == 0) continue;
                if (newY < 0 || newY >= height) continue;
                if (grid[newY][newX] == cells.occupied) count++;
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
