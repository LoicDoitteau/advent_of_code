fs = require("fs");
fs.readFile("./2020/day_20/input.txt", 'utf8', (err, input) => {
    console.time();
    const tiles = input.split('\r\n\r\n').map(tileData => {
        const lines = tileData.split('\r\n');
        const { id } = /Tile (?<id>\d+)/.exec(lines[0]).groups;
        const size = lines[1].length;
        const up = lines[1].split('');
        const down = lines[lines.length - 1].split('');
        const left = Array.from({ length: size }, (_, i) => lines[i + 1][0]);
        const right = Array.from({ length: size }, (_, i) => lines[i + 1][size - 1]);
        const possibilities = new Set([
            up.join(''),
            down.join(''),
            left.join(''),
            right.join(''),
            up.reverse().join(''),
            down.reverse().join(''),
            left.reverse().join(''),
            right.reverse().join('')
        ]);
        return { id: Number(id), possibilities };
    });

    for (let i = 0; i < tiles.length; i++) {
        const tile1 = tiles[i];
        tile1.bordersMatches = tile1.bordersMatches || 0;
        for (let j = i + 1; j < tiles.length; j++) {
            const tile2 = tiles[j];
            tile2.bordersMatches = tile2.bordersMatches || 0;
            const count = [...tile1.possibilities].filter(x => tile2.possibilities.has(x)).length;
            tile1.bordersMatches += count;
            tile2.bordersMatches += count;
        }
    }

    const borders = tiles.filter(tile => tile.bordersMatches == 4);
    const response = borders.reduce((acc, tile) => acc * tile.id, 1);
    console.log(response);
    console.timeEnd();
});
