fs = require("fs");

fs.readFile("./2018/day_22/part_2/input.txt", 'utf8', (err, input) => {
    var [, depth, x, y] = input.match(/depth: (\d+)\r\ntarget: (\d+),(\d+)/).map(Number);
    var cave = {depth, target : {x, y}};
    console.log(Date())
    console.log(getFewestMinutes(cave));
    console.log(Date())
});

var erosionMap = {};

var regionType = {rocky : 0, wet : 1, narrow : 2};
var toolType = {none : 0, torch : 1, climbing : 2};

function getGeologicIndex(x, y, cave) {
    if(x == 0 && y == 0) return 0;
    else if(x == cave.target.x && y == cave.target.y) return 0;
    else if(y == 0) return x * 16807;
    else if(x == 0) return y * 48271;
    else return getErosionLevel(x - 1, y, cave) * getErosionLevel(x, y - 1, cave);
}

function getErosionLevel(x, y, cave) {
    if(erosionMap[y] == undefined) erosionMap[y] = {};
    if(erosionMap[y][x] == undefined) erosionMap[y][x] = (getGeologicIndex(x, y, cave) + cave.depth) % 20183;
    return erosionMap[y][x];
}

function getRegionType(x, y, cave) {
    return getErosionLevel(x, y, cave) % 3;
}

function getFewestMinutes(cave) {
    var toDo = [{x : 0, y : 0, tool : 1, minutes : 0, switching : 0}];
    var visited = {0 : {0 : {1 : 0}}};

    var add = (current, next) => {
        if(next.x < 0 || next.y < 0) return;
        var region = getRegionType(next.x, next.y, cave);
        if(current.tool == region) return;

        if(visited[next.y] == undefined) visited[next.y] = {};
        if(visited[next.y][next.x] == undefined) visited[next.y][next.x] = {};
        if(visited[next.y][next.x][current.tool] == undefined) {
            toDo.push({x : next.x, y : next.y, tool : current.tool, minutes : current.minutes + 1, switching : 0});
            visited[next.y][next.x][current.tool] = current.minutes + 1;
        }
    };

    while(toDo.length > 0) {
        var current = toDo.shift();

        if(current.switching > 0) {
            if(visited[current.y][current.x][current.tool] == undefined) {
                toDo.push({x : current.x, y : current.y, tool : current.tool, minutes : current.minutes + 1, switching : current.switching - 1});
                if(current.switching == 1) visited[current.y][current.x][current.tool] = current.minutes + 1;
            }
            continue;
        }

        if(current.x == cave.target.x && current.y == cave.target.y && current.tool == 1) return current.minutes;

        add(current, {x : current.x + 1, y : current.y});
        add(current, {x : current.x - 1, y : current.y});
        add(current, {x : current.x, y : current.y + 1});
        add(current, {x : current.x, y : current.y - 1});

        var tools = [];
        var region = getRegionType(current.x, current.y, cave);
        if(region == 0) {
            tools = [1, 2];
        } else if(region == 1) {
            tools = [0, 2];
        } else {
            tools = [0, 1];
        }
        tools.forEach(tool => {
            toDo.push({x : current.x, y : current.y, tool, minutes : current.minutes + 1, switching : 6});
        });
    }

    return -1;
}