fs = require("fs");
fs.readFile("./2021/day_15/input.txt", 'utf8', (err, input) => {
    const grid = input.split('\r\n').map(line => line.split('').map(Number))
    part1(grid);
    part2(grid);
});

part1 = (grid) => console.log(getPathCost(grid, {x: 0, y: 0}, {x: grid[grid.length - 1].length - 1, y: grid.length - 1}));
part2 = (grid) => part1(extend(grid));

hash = ({x, y}) => x << 10 | y;

getPathCost = (grid, start, end) => {
    const todo = [{ pos: start, cost: 0 }];
    const costs = new Map([[hash(start), 0]]);

    while (todo.length > 0) {
        const {pos, cost} = todo.shift();
        
        if (pos.x == end.x && pos.y == end.y) return cost;

        for (const neighbor of getNeighbors(grid, pos)) {
            const newCost = cost + grid[neighbor.y][neighbor.x];
            const key = hash(neighbor);

            if (!costs.has(key) || costs.get(key) > newCost) {
                costs.set(key, newCost);
                todo.push({ pos: neighbor, cost: newCost });
            }
        }

        todo.sort((a, b) => a.cost - b.cost);
    }
}

getNeighbors = (grid, {x, y}) => {
    const neighbors = [];

    const add = (position) => grid[position.y] && grid[position.y][position.x] != null && neighbors.push(position);
    
    add({x: x-1, y});
    add({x, y: y-1});
    add({x, y: y+1});
    add({x: x+1, y});
    
    return neighbors;
}

extend = (grid) => {
    const originalHeight = grid.length;
    const originalWidth = grid[0].length;
    const newWidth = originalWidth * 5;
    const newHeight = originalHeight * 5;
    const newGrid = [];

    for (let y = 0; y < newHeight; y++) {
        const row = [];
        const tileY = Math.floor(y / originalHeight);
        for (let x = 0; x < newWidth; x++) {
            const tileX = Math.floor(x / originalWidth);
            let cost = grid[y % originalHeight][x % originalWidth] + tileX + tileY;
            while (cost > 9) cost -= 9;
            row.push(cost);
        }
        newGrid.push(row);
    }

    return newGrid;
}