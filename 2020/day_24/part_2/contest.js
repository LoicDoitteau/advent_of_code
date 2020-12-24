fs = require("fs");
fs.readFile("./2020/day_24/input.txt", 'utf8', (err, input) => {
    console.time();

    const DAYS = 100;

    const colors = {
        WHITE: 0,
        BLACK: 1,
    };

    const dirs = {
        sw: { dx: -1, dy: -1 },
        se: { dx: 1, dy: -1 },
        nw: { dx: -1, dy: 1 },
        ne: { dx: 1, dy: 1 },
        w: { dx: -2, dy: 0 },
        e: { dx: 2, dy: 0 },
    };

    const list = input.split('\r\n').map(line => line.match(/(sw|se|nw|ne|w|e)/g));

    const hash = pos => `${pos.x}|${pos.y}`;

    const neighbors = tile => {
        const tiles = [];

        for (const keyDir in dirs) {
            if (dirs.hasOwnProperty(keyDir)) {
                const dir = dirs[keyDir];
                const pos = { x: tile.pos.x + dir.dx, y: tile.pos.y + dir.dy };
                const key = hash(pos);  
                const neighbor = floor.get(key) || { pos, color: colors.WHITE };
                tiles.push(neighbor);
            }
        }

        return tiles;
    }

    let floor = new Map();

    for (const steps of list) {
        const pos = { x: 0, y: 0 };
        for (const step of steps) {
            const dir = dirs[step];
            pos.x += dir.dx;
            pos.y += dir.dy;
        }
        const key = hash(pos);
        if (!floor.has(key)) floor.set(key, { pos, color: colors.BLACK });
        else {
            const tile = floor.get(key);
            tile.color = 1 - tile.color;
        }
    }

    for (let day = 1; day <= DAYS; day++) {
        const newFloor = new Map();
        const blackTiles = [...floor.values()].filter(tile => tile.color == colors.BLACK);

        for (const blackTile of blackTiles) {
            const tiles = [ blackTile, ...neighbors(blackTile) ];
            for (const tile of tiles) {
                const key = hash(tile.pos);
                if (newFloor.has(key)) continue;

                const copy = { ...tile };
                const blackNeighborsCount = neighbors(copy).filter(tile => tile.color == colors.BLACK).length;
                if (copy.color == colors.BLACK && (blackNeighborsCount == 0 || blackNeighborsCount >2))
                    copy.color = colors.WHITE;
                if (copy.color == colors.WHITE && blackNeighborsCount == 2)
                    copy.color = colors.BLACK;

                newFloor.set(key, copy);
            }
        }

        floor = newFloor;
    }

    const response = [...floor.values()].filter(tile => tile.color == colors.BLACK).length;
    console.log(response);
    console.timeEnd();
});
