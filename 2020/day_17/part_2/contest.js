fs = require("fs");
fs.readFile("./2020/day_17/input.txt", 'utf8', (err, input) => {

    const cycles = 6;

    const cells = {
        INACTIVE: '.',
        ACTIVE: '#'

    };
    
    const hash = pos => `${pos.x}|${pos.y}|${pos.z}|${pos.w}`;

    const neighbors = pos => {
        const arr = [];

        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                for (let dz = -1; dz <= 1; dz++) {
                    for (let dw = -1; dw <= 1; dw++) {
                        if (dx == dy && dy == dz && dz == dw && dw == 0) continue;
                        arr.push({ x: pos.x + dx, y: pos.y + dy, z: pos.z + dz, w: pos.w + dw })
                    }
                }
            }
        }

        return arr;
    }

    const activeNeighbors = pos => neighbors(pos).filter(p => activeCubes.has(hash(p)));
    
    const data = input.split('\r\n');
    let activeCubes = new Map();

    for (let y = 0; y < data.length; y++) {
        const row = data[y];
        for (let x = 0; x < row.length; x++) {
            const cube = row[x];
            if (cube == cells.ACTIVE) {
                const pos = { x, y, z: 0, w: 0 };
                activeCubes.set(hash(pos), pos);
            }
        }
    }

    for (let i = 0; i < cycles; i++) {
        const newActiveCubes = new Map();
        
        for (const [_, pos] of activeCubes) {
            const cubes = [pos, ...neighbors(pos)];
            for (const cube of cubes) {
                const key = hash(cube);
                const activeNeighborsCount = activeNeighbors(cube).length;
                if (   (activeCubes.has(key) && activeNeighborsCount >= 2 & activeNeighborsCount <= 3)
                    || (!activeCubes.has(key) && activeNeighborsCount == 3)) {
                    newActiveCubes.set(key, cube);
                }
            }
        }

        activeCubes = newActiveCubes;
    }

    const response = activeCubes.size;
    console.log(response);
});
