fs = require("fs");

fs.readFile("./2018/day_25/part_1/input.txt", 'utf8', (err, input) => {
    var points = input.split("\r\n").map(s => {
        var [, x, y, z, w] = s.match(/(-?\d+),(-?\d+),(-?\d+),(-?\d+)/).map(Number);
        return {x, y, z, w, close : []};
    });

    points.forEach(point1 => {
        points.forEach(point2 => {
            if(point1 != point2 && Math.abs(point1.x - point2.x) + Math.abs(point1.y - point2.y) + Math.abs(point1.z - point2.z) + Math.abs(point1.w - point2.w) <= 3) {
                point1.close.push(point2);
            }
        });
    });

    console.log(getConstellations(points).length);
});

function getConstellations(points) {
    var constellations = [];

    var add = (point, constellation) => {
        if(!point.added) {
            point.added = true;
            constellation.push(point);
            point.close.forEach(p => add(p, constellation));
        }
    }

    points.forEach(point1 => {
        var constellation = constellations.find(points => points.some(point2 => point1 == point2)) || [];
        if(constellation.length == 0) constellations.push(constellation);
        add(point1, constellation);
    })

    return constellations;
}