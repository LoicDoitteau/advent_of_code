fs = require("fs");

fs.readFile("./2018/day_11/part_2/input.txt", 'utf8', (err, input) => {
    var serialNumber = Number(input);
    var grid = Array.from({length : 300}, (_, y) => Array.from({length : 300}, (_, x) => {
        var id = (x + 1) + 10;
        return Number(String((id * (y + 1) + serialNumber) * id).split("").reverse()[2]) - 5;
    }));
    var max = -Infinity;
    var coord = {};
    for(var size = 1; size <= 300; size++) {
        for(var x = 0; x <= 300 - size; x++) {
            for(var y = 0; y <= 300 - size; y++) {
                var power = 0;
                for(var dx = 0; dx < size; dx++) {
                    for(var dy = 0; dy < size; dy++){
                        power += grid[y + dy][x + dx];
                    }
                }
                if(power > max) {
                    max = power;
                    coord = {x : x + 1, y : y + 1, size};
                    console.log(coord);
                    console.log(power);
                }
            }
        }
    }
    console.log(coord);
    console.log(max);
});