fs = require("fs");
fs.readFile("./2020/day_3/input.txt", 'utf8', (err, input) => {
    
    const tiles = {
        open: '.',
        tree: '#'
    }
    const grid = input.split("\r\n").map(s => s.split(''));
    const width = grid[0].length;
    const height = grid.length;

    const slopes = [
        { dx: 1, dy: 1 },
        { dx: 3, dy: 1 },
        { dx: 5, dy: 1 },
        { dx: 7, dy: 1 },
        { dx: 1, dy: 2 }
    ];
    
    const checkSlope = (slope) => {
        const pos = { x: 0, y: 0 };
        let trees = 0;
        while (pos.y < height) {
            const { x, y } = pos;
            if (grid[y][x] == tiles.tree) trees++;
            pos.x = (pos.x + slope.dx) % width;
            pos.y += slope.dy;
        }
        return trees;
    }

    // const response = checkSlope({ dx: 3, dy: 1 });
    const response = slopes.reduce((acc, slope) => acc * checkSlope(slope), 1);

    console.log(response);
});
