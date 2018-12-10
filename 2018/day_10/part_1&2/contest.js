fs = require("fs");

fs.readFile("./2018/day_10/part_1/input.txt", 'utf8', (err, input) => {
    var p = /position=< *(-?\d+), *(-?\d+)> velocity=< *(-?\d+), *(-?\d+)>/;
    var points = input.split('\n').map(s => {
        var [, px, py, vx, vy] = s.match(p).map(Number);
        return {pos : {x : px, y : py}, vel : {x : vx, y : vy}};
    });

    // Approximated by the commented code
    var i = 10600;

    // var min = points.reduce((acc, point) => {
    //     acc.x = Math.min(point.pos.x + point.vel.x * i, acc.x);
    //     acc.y = Math.min(point.pos.y + point.vel.y * i, acc.y);
    //     return acc;
    // }, {x : Infinity, y : Infinity});
    // var max = points.reduce((acc, point) => {
    //     acc.x = Math.max(point.pos.x + point.vel.x * i, acc.x);
    //     acc.y = Math.max(point.pos.y + point.vel.y * i, acc.y);
    //     return acc;
    // }, {x : -Infinity, y : -Infinity});
    // var dist = {x : max.x - min.x, y : max.y - min.y};
    // console.log(dist);

    var f = () => {
        console.clear();
        console.log(i);
        var min = points.reduce((acc, point) => {
            acc.x = Math.min(point.pos.x + point.vel.x * i, acc.x);
            acc.y = Math.min(point.pos.y + point.vel.y * i, acc.y);
            return acc;
        }, {x : Infinity, y : Infinity});
        var max = points.reduce((acc, point) => {
            acc.x = Math.max(point.pos.x + point.vel.x * i, acc.x);
            acc.y = Math.max(point.pos.y + point.vel.y * i, acc.y);
            return acc;
        }, {x : -Infinity, y : -Infinity});
        var dist = {x : max.x - min.x, y : max.y - min.y};
        if(dist.x <= 200 && dist.y <= 200) {
            for(var y = 0; y <= max.y - min.y; y++) {
                var line = "";
                for(var x = 0; x <= max.x - min.x; x++) {
                    line += points.some(p => p.pos.x + p.vel.x * i == x + min.x && p.pos.y + p.vel.y * i == y + min.y) ? "#" : "."; 
                }
                console.log(line)
            }
        }
        i++;
    }
    setInterval(f, 1000);
});