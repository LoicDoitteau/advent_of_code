fs = require("fs");
fs.readFile("./2019/day_20/input.txt", 'utf8', (err, data) => {
    const startTime = new Date().getTime();
    const DEBUG = true;
    let res = null;

    const isPortal = cell => cell >= "A" && cell <= "Z";
    const isWalkable = cell => cell == ".";
    const isEntry = key => key == "AA";
    const isExit = key => key == "ZZ";

    const getNeighbors = pos => [{x : pos.x, y : pos.y - 1}, {x: pos.x, y : pos.y + 1}, {x : pos.x - 1, y : pos.y}, {x : pos.x + 1, y : pos.y}];
    const getNext = pos => [{x: pos.x, y : pos.y + 1}, {x : pos.x + 1, y : pos.y}];

    const getMap = data => {
        const grid = {};
        const portals = {};
        let entry = null;
        let exit = null;
        const map = data.split('\r\n').map(row => row.split(''));
        for (let y = 0; y < map.length; y++) {
            const row = map[y];
            for (let x = 0; x < row.length; x++) {
                const cell = row[x];
                if(isWalkable(cell)) {
                    if(grid[y] == undefined) grid[y] = {};
                    grid[y][x] = true;
                }
                else if(isPortal(cell)) {
                    const current = {x, y};
                    const next = getNext(current).find(pos => map[pos.y] && isPortal(map[pos.y][pos.x]));
                    if(next != undefined) {
                        const key = cell + map[next.y][next.x];
                        const pos = [].concat(...[current, next].map(pos => getNeighbors(pos))).find(pos => map[pos.y] != undefined && isWalkable(map[pos.y][pos.x]))
                        if(isEntry(key)) entry = pos;
                        else if(isExit(key)) exit = pos;
                        else {
                            if(portals[key] == undefined) portals[key] = [];
                            portals[key].push(pos);
                        }
                    }
                }
            }
        }
        
        return {grid, portals, entry, exit};
    }

    const getDistances = map => {
        const distances = {};
        const toDo = [map.entry];
        distances[map.entry.y] = {};
        distances[map.entry.y][map.entry.x] = 0;

        while(toDo.length > 0) {
            const current = toDo.shift();

            for (const neighbor of getNeighbors(current)) {
                if(map.grid[neighbor.y] != undefined && map.grid[neighbor.y][neighbor.x] != undefined) {
                    if(distances[neighbor.y] == undefined) distances[neighbor.y] = {};
                    if(distances[neighbor.y][neighbor.x] == undefined) {
                        distances[neighbor.y][neighbor.x] = distances[current.y][current.x] + 1;
                        toDo.push(neighbor);
                    }
                }
            }
            for (const key in map.portals) {
                const pos = map.portals[key];
                const index = pos.findIndex(p => p.x == current.x && p.y == current.y);
                if(index != -1) {
                    const next = pos[1 - index];
                    if(distances[next.y] == undefined) distances[next.y] = {};
                    if(distances[next.y][next.x] == undefined) {
                        distances[next.y][next.x] = distances[current.y][current.x] + 1;
                        toDo.push(next);
                    }
                    break;
                }
            }
        }

        return distances;
    }

    const map = getMap(data)
    const distances = getDistances(map);
    res = distances[map.exit.y][map.exit.x];

    console.log(res);
    const elapsedTime = new Date().getTime() - startTime;
    console.log(`Elapsed : ${elapsedTime} ms`);
});
