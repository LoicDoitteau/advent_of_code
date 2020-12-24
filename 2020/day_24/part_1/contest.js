fs = require("fs");
fs.readFile("./2020/day_24/input.txt", 'utf8', (err, input) => {
    console.time();

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

    const tiles = new Map();

    for (const steps of list) {
        const pos = { x: 0, y: 0 };
        for (const step of steps) {
            const dir = dirs[step];
            pos.x += dir.dx;
            pos.y += dir.dy;
        }
        const key = hash(pos);
        if (!tiles.has(key)) tiles.set(key, colors.BLACK);
        else tiles.set(key, 1 - tiles.get(key));
    }

    const response = [...tiles.values()].filter(color => color == colors.BLACK).length;
    console.log(response);
    console.timeEnd();
});
