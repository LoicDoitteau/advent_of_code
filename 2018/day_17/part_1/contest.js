fs = require("fs");

fs.readFile("./2018/day_17/part_1/input.txt", 'utf8', (err, input) => {
    var p = /(x|y)=(\d+), (y|x)=(\d+)\.\.(\d+)/
    var veins = input.split("\r\n").map(s => {
        var [, axis1, coord1, , coord2, coord3] = s.match(p);
        coord1 = Number(coord1);
        coord2 = Number(coord2);
        coord3 = Number(coord3);
        var dist = coord3 - coord2 + 1;
        if(axis1 == 'x') return {x : coord1, y : coord2, w : 1, h : dist};
        else return {x : coord2, y : coord1, w : dist, h : 1};
    }, []);
    var spring = {x : 500, y : 0};
    var min = veins.reduce((acc, v) => {
        acc.x = Math.min(acc.x, v.x - 1, spring.x - 1);
        acc.y = Math.min(acc.y, v.y, spring.y);
        return acc;
    }, {x : Infinity, y : Infinity});
    var max = veins.reduce((acc, v) => {
        acc.x = Math.max(acc.x, v.x + v.w, spring.x + 1);
        acc.y = Math.max(acc.y, v.y + v.h - 1, spring.y);
        return acc;
    }, {x : -Infinity, y : -Infinity});

    var grid = Array.from({length : max.y - min.y + 1}, _ => Array.from({length : max.x - min.x + 1}, _ => '.'));
    grid[spring.y - min.y][spring.x - min.x] = '+';
    veins.forEach(v => {
        for(var dx = 0; dx < v.w; dx++) {
            for(var dy = 0; dy < v.h; dy++) {
                grid[v.y + dy - min.y][v.x + dx - min.x] = '#';
            }
        }
    });

    var oldGrid;
    do {
        var oldGrid = grid.map(row => row.map(val => val));
        dropWater({x : spring.x - min.x, y : spring.y - min.y}, grid);
    } while(oldGrid.some((row, y) => row.some((val, x) => val != grid[y][x])));

    fs.writeFile("./2018/day_17/part_1/output.txt", grid.reduce((acc, row) => acc + row.join('') + '\n', ""), function(err) {
        if(err) {
            return console.log(err);
        }

        console.log("The file was saved!");
    });

    var r = grid.reduce((acc1, row) => row.reduce((acc2, val) => {
        if(val == '~' || val == '|') acc2++;
        return acc2;
    }, acc1), 0);
    console.log(r);

    console.log(min, max);
});


function dropWater(pos, grid) {
    var droping = (grid[pos.y + 1][pos.x] == '.' || grid[pos.y + 1][pos.x] == '|');
    while(droping) {
        pos.y++;
        grid[pos.y][pos.x] = '|';
        if(grid[pos.y + 1] == undefined) {
            droping = false;
        }
        else if(grid[pos.y + 1][pos.x] != '.' && grid[pos.y + 1][pos.x] != '|') {
            droping = false;
            if(expandWater({x : pos.x, y : pos.y}, -1, grid) + expandWater({x : pos.x, y : pos.y}, 1, grid) == 0) {
                grid[pos.y][pos.x] = '~';
                restWater({x : pos.x, y : pos.y}, -1, grid);
                restWater({x : pos.x, y : pos.y}, 1, grid);
            }
        }
    }
}

function expandWater(pos, dx, grid) {
    var expanding = (grid[pos.y][pos.x + dx] == '.' || grid[pos.y][pos.x + dx] == '|');
    if(expanding) {
        while(true) {
            pos.x += dx;
            grid[pos.y][pos.x] = '|';
            if(grid[pos.y + 1][pos.x] == '.' || grid[pos.y + 1][pos.x] == '|') {
                dropWater({x : pos.x, y : pos.y}, grid);
                return true;
            } else if(grid[pos.y][pos.x + dx] != '.' && grid[pos.y][pos.x + dx] != '|') {
                return false;
            }
        }
    }
    return false;
}

function restWater(pos, dx, grid) {
    var expanding = (grid[pos.y][pos.x + dx] == '.' || grid[pos.y][pos.x + dx] == '|');
    while(expanding) {
        pos.x += dx;
        grid[pos.y][pos.x] = '~';
        if(grid[pos.y][pos.x + dx] != '.' && grid[pos.y][pos.x + dx] != '|') expanding = false;
    }
}