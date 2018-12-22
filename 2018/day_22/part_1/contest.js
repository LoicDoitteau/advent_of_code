fs = require("fs");

fs.readFile("./2018/day_22/part_1/input.txt", 'utf8', (err, input) => {
    var [, depth, x, y] = input.match(/depth: (\d+)\r\ntarget: (\d+),(\d+)/).map(Number);
    var cave = {depth, target : {x, y}};
    var riskLevel = 0;
    for(var i = 0; i <= x; i++) {
        for(var j = 0; j <= y; j++) {
            riskLevel += getRegionType({x : i, y : j}, cave);
        }
    }
    console.log(riskLevel);
});

var geologicMap = {};

function getGeologicIndex(pos, cave) {
    if(geologicMap[pos.x + pos.y * cave.depth] != undefined) return geologicMap[pos.x + pos.y * cave.depth];
    var geologicIndex;
    if(pos.x == 0 && pos.y == 0) geologicIndex =  0;
    else if(pos.x == cave.target.x && pos.y == cave.target.y) geologicIndex = 0;
    else if(pos.y == 0) geologicIndex = pos.x * 16807;
    else if(pos.x == 0) geologicIndex = pos.y * 48271;
    else geologicIndex = getErosionLevel({x : pos.x -1, y : pos.y}, cave) * getErosionLevel({x : pos.x, y : pos.y - 1}, cave);
    geologicMap[pos.x + pos.y * cave.depth] = geologicIndex;
    return geologicIndex;
}

function getErosionLevel(pos, cave) {
    return (getGeologicIndex(pos, cave) + cave.depth) % 20183;
}

function getRegionType(pos, cave) {
    return getErosionLevel(pos, cave) % 3;
}