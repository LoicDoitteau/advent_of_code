fs = require("fs");
fs.readFile("./2019/day_20/input.txt", 'utf8', (err, data) => {
    const startTime = new Date().getTime();
    const DEBUG = false;
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
        let minX, maxX, minY, maxY = null;
        for (let y = 0; y < map.length; y++) {
            const row = map[y];
            for (let x = 0; x < row.length; x++) {
                const cell = row[x];
                if(isWalkable(cell)) {
                    if(grid[y] == undefined) grid[y] = {};
                    grid[y][x] = true;
                    if(minX == null || minX > x) minX = x;
                    if(maxX == null || maxX < x) maxX = x;
                    if(minY == null || minY > y) minY = y;
                    if(maxY == null || maxY < y) maxY = y;
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
                            portals[key].push({pos});
                        }
                    }
                }
            }
        }
        for (const key in portals) {
            const portal = portals[key];
            for (const p of portal) {
                const outward = p.pos.x == minX || p.pos.x == maxX || p.pos.y == minY || p.pos.y == maxY;
                p.outward = outward;
            }
        }
        
        return {grid, portals, entry, exit};
    }

    const getDistances = map => {
        const distances = {};
        const toDo = [{pos : map.entry, level : 0}];
        distances[0] = {}
        distances[0][map.entry.y] = {};
        distances[0][map.entry.y][map.entry.x] = 0;

        while(toDo.length > 0) {
            const current = toDo.shift();
            const currentPos = current.pos;
            const currentLevel = current.level;

            if(DEBUG) console.log(current.pos, current.level);

            if(currentLevel == 0 && currentPos.x == map.exit.x && currentPos.y == map.exit.y) break;

            for (const neighbor of getNeighbors(currentPos)) {
                if(map.grid[neighbor.y] != undefined && map.grid[neighbor.y][neighbor.x] != undefined) {
                    if(distances[currentLevel] == undefined) distances[currentLevel] = {}
                    if(distances[currentLevel][neighbor.y] == undefined) distances[currentLevel][neighbor.y] = {};
                    if(distances[currentLevel][neighbor.y][neighbor.x] == undefined) {
                        distances[currentLevel][neighbor.y][neighbor.x] = distances[currentLevel][currentPos.y][currentPos.x] + 1;
                        toDo.push({pos : neighbor, level : currentLevel});
                    }
                }
            }
            for (const key in map.portals) {
                const portal = map.portals[key];
                const index = portal.findIndex(p => p.pos.x == currentPos.x && p.pos.y == currentPos.y);
                if(index != -1) {
                    const next = portal[1 - index];
                    const nextLevel = next.outward ? currentLevel + 1 : currentLevel - 1;
                    if(nextLevel >= 0) {
                        if(distances[nextLevel] == undefined) distances[nextLevel] = {};
                        if(distances[nextLevel][next.pos.y] == undefined) distances[nextLevel][next.pos.y] = {};
                        if(distances[nextLevel][next.pos.y][next.pos.x] == undefined) {
                            distances[nextLevel][next.pos.y][next.pos.x] = distances[currentLevel][currentPos.y][currentPos.x] + 1;
                            toDo.push({pos : next.pos, level: nextLevel});
                        }
                    }
                    break;
                }
            }
        }

        return distances;
    }

    const map = getMap(data)
    const distances = getDistances(map);
    res = distances[0][map.exit.y][map.exit.x];

    console.log(res);
    const elapsedTime = new Date().getTime() - startTime;
    console.log(`Elapsed : ${elapsedTime} ms`);
});
