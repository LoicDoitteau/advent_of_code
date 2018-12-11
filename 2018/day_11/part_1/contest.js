fs = require("fs");

fs.readFile("./2018/day_11/part_1/input.txt", 'utf8', (err, input) => {
    var serialNumber = Number(input);
    var grid = Array.from({length : 300}, (_, y) => Array.from({length : 300}, (_, x) => {
        var id = (x + 1) + 10;
        return Number(String((id * (y + 1) + serialNumber) * id).split("").reverse()[2]) - 5;
    }));
    var max = -Infinity;
    var coord = {};
    for(var x = 1; x < 299; x++) {
        for(var y = 1; y < 299; y++) {
            var power = grid[y - 1][x - 1] + grid[y - 1][x + 0] + grid[y - 1][x + 1]
                      + grid[y + 0][x - 1] + grid[y + 0][x + 0] + grid[y + 0][x + 1]  
                      + grid[y + 1][x - 1] + grid[y + 1][x + 0] + grid[y + 1][x + 1];
            if(power > max) {
                max = power;
                coord = {x, y};
            }
        }
    }
    for(var dy = - 1; dy <= 1; dy++) {
        console.log(grid[coord.y + dy][coord.x - 1] + ' ' + grid[coord.y + dy][coord.x] + ' ' + grid[coord.y + dy][coord.x + 1]);
    }
    console.log(coord);
    console.log(max);
});