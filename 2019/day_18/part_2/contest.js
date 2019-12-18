fs = require("fs");
fs.readFile("./2019/day_18/input.txt", 'utf8', (err, data) => {
    const startTime = new Date().getTime();
    const DEBUG = false;
    let res = null;

    const tiles = {EMPTY : ".", WALL : "#", ENTRANCE : "@"};
    const isEmpty = cell => cell == tiles.EMPTY;
    const isWall = cell => cell == tiles.WALL;
    const isEntrance = cell => cell == tiles.ENTRANCE;
    const isDoor = cell => cell >= "A" && cell <= "Z";
    const iskey = cell => cell >= "a" && cell <= "z";
    const isAccessible = cell => isEmpty(cell) || isEntrance(cell) || iskey(cell);

    const getNeighbors = pos => [{x : pos.x, y : pos.y - 1}, {x: pos.x, y : pos.y + 1}, {x : pos.x - 1, y : pos.y}, {x : pos.x + 1, y : pos.y}];

    const getGrid = data => data.split("\r\n").map(row => row.split(""));

    // TODO : Opti
    const hash = grid => grid.reduce((acc, row) => acc + row.join(""), "");

    const showGrid = grid => console.log(grid.reduce((acc, row) => acc + row.join('') + "\r\n", ""));

    const splitEntrance = grid => {
        const entrances = getEntrancesPos(grid);
        if(entrances.length = 1) {
            const entrance = entrances[0];
            grid[entrance.y - 1][entrance.x - 1] = tiles.ENTRANCE;
            grid[entrance.y - 1][entrance.x] = tiles.WALL;
            grid[entrance.y - 1][entrance.x + 1] = tiles.ENTRANCE;
            grid[entrance.y][entrance.x - 1] = tiles.WALL;
            grid[entrance.y][entrance.x] = tiles.WALL;
            grid[entrance.y][entrance.x + 1] = tiles.WALL;
            grid[entrance.y + 1][entrance.x - 1] = tiles.ENTRANCE;
            grid[entrance.y + 1][entrance.x] = tiles.WALL;
            grid[entrance.y + 1][entrance.x + 1] = tiles.ENTRANCE;
        }
        return grid;
    }

    const getEntrancesPos = grid => {
        let entrances = [];
        for (let y = 0; y < grid.length; y++) {
            const col = grid[y];
            for (let x = 0; x < col.length; x++) {
                const cell = col[x];
                if(isEntrance(cell)) entrances.push({x, y});
            }
        }
        return entrances;
    }

    const getDoorPos = (grid, key) => {
        const door = key.toUpperCase();
        for (let y = 0; y < grid.length; y++) {
            const col = grid[y];
            for (let x = 0; x < col.length; x++) {
                const cell = col[x];
                if(cell == door) return {x, y};
            }
        }
        return null;
    }

    const getAccessibleKeys = (grid, fromPos) => {
        const keys = {};
        const toDo = [fromPos];
        const visited = {};
        visited[fromPos.y] = {};
        visited[fromPos.y][fromPos.x] = 0;

        while(toDo.length > 0) {
            const current = toDo.shift();

            for(const neighbor of getNeighbors(current)) {
                if(!visited[neighbor.y]) visited[neighbor.y] = {}
                if(grid[neighbor.y] && isAccessible(grid[neighbor.y][neighbor.x]) && visited[neighbor.y][neighbor.x] == undefined) {
                    visited[neighbor.y][neighbor.x] = visited[current.y][current.x] + 1;
                    if(iskey(grid[neighbor.y][neighbor.x])) keys[grid[neighbor.y][neighbor.x]] = {pos : neighbor, dist : visited[neighbor.y][neighbor.x]};
                    else toDo.push(neighbor);
                }
            }
        }

        return keys;
    }

    const getAccessibleKeysByEntrance = grid => {
        const entrancesPos = getEntrancesPos(grid);
        const keysByEntrance = [];
        
        for (const entrancePos of entrancesPos) {
            const keys = getAccessibleKeys(grid, entrancePos);
            keysByEntrance.push({entrancePos, keys});
        }
        return keysByEntrance;
    }

    const getMinStepsToGetKeys = grid => {
        let memo = {};
        const rec = grid => {
            const keysByEntrance = getAccessibleKeysByEntrance(grid);
            if(DEBUG) showGrid();
            if(keysByEntrance.every(obj => Object.keys(obj.keys).length == 0)) return 0;
            const memoKey = hash(grid);
            if(memo[memoKey]) return memo[memoKey];
            
            const distances = keysByEntrance.reduce((acc, obj) => acc.concat(Object.keys(obj.keys).map(k => {
                const newGrid = grid.map(row => row.map(cell => cell));
                const entrancePos = obj.entrancePos;
                const doorPos = getDoorPos(newGrid, k);
                const keyPos = obj.keys[k].pos;
                const keyDist = obj.keys[k].dist;
                newGrid[entrancePos.y][entrancePos.x] = tiles.EMPTY;
                newGrid[keyPos.y][keyPos.x] = tiles.ENTRANCE;
                if(doorPos) newGrid[doorPos.y][doorPos.x] = tiles.EMPTY;
                return keyDist + rec(newGrid);
            })), []);

            memo[memoKey] = Math.min(...distances);

            return memo[memoKey];
        }
        return rec(grid);
    }

    res = getMinStepsToGetKeys(splitEntrance(getGrid(data)));
    console.log(res);
    const elapsedTime = new Date().getTime() - startTime;
    console.log(`Elapsed : ${elapsedTime} ms`);
});