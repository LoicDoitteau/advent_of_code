fs = require("fs");
fs.readFile("./2021/day_11/input.txt", 'utf8', (err, input) => {
    const grid = input.split('\r\n').map(line => line.split('').map(Number));
    part2(grid);
});

part2 = (grid) => {
    let stepsCount = 0;

    while (!allFlashes(grid)) {
        grid = step(grid);
        stepsCount++;
    }

    console.log(stepsCount);
};

allFlashes = (grid) => grid.every(row => row.every(energy => energy == 0));

step = (grid) => exhaust(flashes(increase(grid)));

increase = (grid) => grid.map(row => row.map(energy => energy + 1));

flashes = (grid) => {
    const flashed = new Set();
    const flashing = [];
    
    for (let y = 0; y < grid.length; y++) {
        const row = grid[y];
        for (let x = 0; x < row.length; x++) {
            const energy = row[x];
            if (energy > 9) {
                const position = {x, y};
                flashing.push(position);
                flashed.add(hash(x, y));
            }
        }
    }

    while (flashing.length > 0) {
        const position = flashing.shift();
        for (const neighbor of getNeighbors(grid, position.x, position.y)) {
            const key = hash(neighbor.x, neighbor.y);
            ++grid[neighbor.y][neighbor.x] > 9 && !flashed.has(key) && flashed.add(key) && flashing.push(neighbor);
        }
    }

    return grid;
}

exhaust = (grid) => grid.map(row => row.map(energy => energy > 9 ? 0 : energy));

hash = (x, y) => x << 10 | y;

getNeighbors = (grid, x, y) => {
    const neighbors = [];
    const add = (position) => grid[position.y] && grid[position.y][position.x] != null && neighbors.push(position);
    add({x: x-1, y: y-1});
    add({x: x-1, y});
    add({x: x-1, y: y+1});
    add({x, y: y-1});
    add({x, y: y+1});
    add({x: x+1, y: y-1});
    add({x: x+1, y});
    add({x: x+1, y: y+1});
    return neighbors;
}
