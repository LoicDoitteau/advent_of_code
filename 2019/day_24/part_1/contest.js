fs = require("fs");
fs.readFile("./2019/day_24/input.txt", 'utf8', (err, data) => {
    const startTime = new Date().getTime();
    const DEBUG = true;
    const tiles = {"." : 0, "#" : 1};
    let res = null;

    const getGrid = () => data.split('\r\n').map(row => row.split('').map(v => tiles[v]));

    const getBiodiversityRating = grid => [].concat(...grid).reduce((acc, v, i) => acc + v * (1 << i), 0);

    const getNeighbors = (x, y) => [{x, y : y - 1}, {x : x + 1, y}, {x, y : y + 1}, {x : x - 1, y}];

    const evolve = grid => grid.map((row, y) => row.map((v, x) => {
        const bugs = getNeighbors(x, y).reduce((acc, p) => (grid[p.y] && grid[p.y][p.x]) ? acc + 1 : acc, 0);
        if(v == 0 && (bugs == 1 || bugs == 2)) return 1;
        if(v == 1 && bugs != 1) return 0;
        return v;
    }));
    
    const getResponse = () => {
        const memo = {};
        let grid = getGrid();
        memo[getBiodiversityRating(grid)] = true;

        while(true) {
            grid = evolve(grid);
            const biodiversityRating = getBiodiversityRating(grid);
            if(memo[biodiversityRating]) return biodiversityRating;
            memo[biodiversityRating] = true;
        }
    }

    res = getResponse();
    console.log(res);
    const elapsedTime = new Date().getTime() - startTime;
    console.log(`Elapsed : ${elapsedTime} ms`);
});
