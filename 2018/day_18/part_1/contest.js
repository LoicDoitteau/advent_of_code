fs = require("fs");

fs.readFile("./2018/day_18/part_1/input.txt", 'utf8', (err, input) => {
    var grid = input.split("\r\n").map(s => s.split(""));
    var height = grid.length;
    var width = grid[0].length;
    var minutes = 10;
    for(var i = 0; i < minutes; i++) {
        var newGrid = Array.from({length : height}, _ => Array.from({length : width}));
        for(var y = 0; y < height; y++) {
            for(var x = 0; x < width; x++) {
                var neighbors = getNeighbors(x, y, grid);
                if(grid[y][x] == '.') {
                    newGrid[y][x] = neighbors['|'] >= 3 ? '|' : '.';
                } else if(grid[y][x] == '|') {
                    newGrid[y][x] = neighbors['#'] >= 3 ? '#' : '|';
                } else {
                    newGrid[y][x] = neighbors['#'] >= 1 && neighbors['|'] >= 1 ? '#' : '.';
                }
            }
        }
        grid = newGrid;
    }
    var r = grid.reduce((acc1, row) => row.reduce((acc2, val) => {
        acc2[val]++;
        return acc2;
    }, acc1), {'.' : 0, '|' : 0, '#' : 0});
    console.log(r['|'] * r['#']);
});

function getNeighbors(x, y, grid) {
    var neighbors = {};
    for(var dy = -1; dy <= 1; dy++) {
        if(grid[y + dy] != undefined) {
            for(var dx = -1; dx <= 1; dx++) {
                if(dy == 0 && dx == 0) continue;
                if(grid[y + dy][x + dx] != undefined) {
                    var c = grid[y + dy][x + dx];
                    if(neighbors[c] == undefined) neighbors[c] = 0;
                    neighbors[c]++;
                }
            }
        }
    }
    return neighbors;
}