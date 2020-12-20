fs = require("fs");
fs.readFile("./2020/day_20/input.txt", 'utf8', (err, input) => {
    console.time();
    const tiles = input.split('\r\n\r\n').map(tileData => {
        const lines = tileData.split('\r\n');
        const { id } = /Tile (?<id>\d+)/.exec(lines[0]).groups;
        const pixels = lines.slice(1).map(row => row.split(''));
        const size = pixels.length;
        return { id: Number(id), pixels, size };
    });

    const seaMonster =
    ['                  # ', 
     '#    ##    ##    ###' ,
     ' #  #  #  #  #  #   '].map(line => line.split(''));
    const seaMonsterWidth = seaMonster[0].length;
    const seaMonsterHeight = seaMonster.length;

    const tileSize = tiles[0].size
    const imageSize = Math.sqrt(tiles.length) * (tileSize - 2);


    const up = tile => tile.pixels[0].join('');
    const down = tile => tile.pixels[tile.size - 1].join('');
    const left = tile => Array.from({ length: tile.size }, (_, i) => tile.pixels[i][0]).join('');
    const right = tile => Array.from({ length: tile.size }, (_, i) => tile.pixels[i][tile.size - 1]).join('');

    const flipY = tile => ({ ...tile, pixels: [...tile.pixels].reverse() });

    const rot90 = tile => ({ ...tile, pixels: Array.from({ length: tile.size }, (_, y) => Array.from({ length: tile.size }, (_, x) => tile.pixels[tile.size - 1 - x][y] )) });
    const rot180 = tile => ({ ...tile, pixels: Array.from({ length: tile.size }, (_, y) => Array.from({ length: tile.size }, (_, x) => tile.pixels[tile.size - 1 - y][tile.size - 1 - x] )) });
    const rot270 = tile => ({ ...tile, pixels: Array.from({ length: tile.size }, (_, y) => Array.from({ length: tile.size }, (_, x) => tile.pixels[x][tile.size - 1 - y] )) });

    const possibilities = tile => [tile, rot90(tile), rot180(tile), rot270(tile), flipY(tile), flipY(rot90(tile)), flipY(rot180(tile)), flipY(rot270(tile))];

    const todo = [tiles[0]];
    const done = new Set();
    while (todo.length) {
        const tile1 = todo.shift();
        if (done.has(tile1.id)) continue;
        const upt1 = up(tile1);
        const downt1 = down(tile1);
        const left1 = left(tile1);
        const right1 = right(tile1);
        for (let i = 0; i < tiles.length; i++) {
            const tile2 = tiles[i];
            if (done.has(tile2.id) || tile1.id == tile2.id) continue;
            for (const possibility of possibilities(tile2)) {             
                if (upt1 == down(possibility)) {
                    tiles[i] = possibility;
                    tile1.up = possibility;
                    possibility.down = tile1;
                    todo.push(possibility);
                    break;
                }
                if (downt1 == up(possibility))  {
                    tiles[i] = possibility;
                    tile1.down = possibility;
                    possibility.up = tile1;
                    todo.push(possibility);
                    break;
                }
                if (left1 == right(possibility))  {
                    tiles[i] = possibility;
                    tile1.left = possibility;
                    possibility.right = tile1;
                    todo.push(possibility);
                    break;
                }
                if (right1 == left(possibility)) {
                    tiles[i] = possibility;
                    tile1.right = possibility;
                    possibility.left = tile1;
                    todo.push(possibility);
                    break;
                }
            }
        }
        done.add(tile1.id);
    }

    const upperLeft = tiles.find(t => !t.left && !t.up);
    let current = upperLeft;
    let currentLineLefter = current;
    const image = [];
    let currentLine = [];
    let y = 1;
    while(current != null)
    {
        for (let x = 1; x < tileSize - 1; x++) {
            const element = current.pixels[y][x];
            currentLine.push(element);
        }
        
        current = current.right;
        if (!current) {
            image.push(currentLine);
            currentLine = [];
            if (++y == tileSize - 1) {
                y = 1;
                current = currentLineLefter.down;
                currentLineLefter = current;
            } else {
                current = currentLineLefter;
            }
        }
    }

    const tile = flipY(rot180({ size: imageSize, pixels: image}));
    const pixels = tile.pixels;
    const positions = []
    for (let y = 0; y < imageSize - seaMonsterHeight; y++) {
        for (let x = 0; x < imageSize - seaMonsterWidth; x++) {
            if (seaMonster.every((line, dy) => line.every((cell, dx) => cell == ' ' || cell == pixels[y + dy][x + dx])))
                positions.push({x, y});
        }
    }
    for (const position of positions) {
        for (let dy = 0; dy < seaMonsterHeight; dy++) {
            for (let dx = 0; dx < seaMonsterWidth; dx++) {
                if (seaMonster[dy][dx] == '#')
                    tile.pixels[position.y + dy][position.x + dx] = 'O'
            }
        }
    }

    fs.writeFile(`./2020/day_20/output.txt`, tile.pixels.reduce((acc, line) => acc + line.join('') + '\r\n', ''), function(err) {
        if(err) return console.log(err);
        console.log("The file was saved!");
    });

    const response = tile.pixels.reduce((acc1, row) => row.reduce((acc2, cell) => acc2 + (cell == '#'), acc1), 0);
    console.log(response);
    console.timeEnd();
});
