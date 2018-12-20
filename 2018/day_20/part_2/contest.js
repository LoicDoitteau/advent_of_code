fs = require("fs");

fs.readFile("./2018/day_20/part_2/input.txt", 'utf8', (err, input) => {
    input = input.substring(1, input.length - 1);
    var pos = {x : 0, y : 0};
    var output = [];
    process(input, pos, output);
    var min = output.reduce((acc, p) => {
        acc.x = Math.min(acc.x, p.x - 1);
        acc.y = Math.min(acc.y, p.y - 1);
        return acc;
    }, {x : Infinity, y : Infinity});
    var max = output.reduce((acc, p) => {
        acc.x = Math.max(acc.x, p.x + 1);
        acc.y = Math.max(acc.y, p.y + 1);
        return acc;
    }, {x : -Infinity, y : -Infinity});
    var grid = Array.from({length : max.y - min.y + 1}, _ => Array.from({length : max.x - min.x + 1}, _ => '#'));
    grid[pos.y - min.y][pos.x - min.x] = 'X'
    output.forEach(p => grid[p.y - min.y][p.x - min.x] = '.');
    var distanceMap = getDistanceMap({x : pos.x - min.x, y : pos.y - min.y}, grid);
    console.log(Math.ceil(distanceMap.filter(d => d.dist >= 2000).length / 2));
    fs.writeFile("./2018/day_20/part_2/output.txt", grid.reduce((acc, row) => acc + row.join('') + '\n', ""), function(err) {
        if(err) {
            return console.log(err);
        }

        console.log("The file was saved!");
    });
});

var dir = {
    'N' : {dx : 0, dy : -1},
    'E' : {dx : 1, dy : 0},
    'S' : {dx : 0, dy : 1},
    'W' : {dx : -1, dy : 0}
};

function process(path, startPos, output) {
    var i = path.indexOf('(');
    var pos = startPos;
    for(i = 0; i < path.length; i++) {
        if(path[i] == '(') {
            var j, k;
            for(j = i + 1, k = 1; j < path.length; j++) {
                if(path[j] == '(') k++;
                else if(path[j] == ')') k--;
                if(k == 0) {
                    break;
                }
            }
            var m;
            for(var n = m = i + 1, k = 1; n < j; n++) {
                if(path[n] == '(') k++;
                else if(path[n] == ')') k--;
                else if(path[n] == '|' && k == 1) {
                    process(path.substring(m, n), pos, output);
                    m = n + 1;
                }
            }
            process(path.substring(m, j), pos, output);
            path = path.substring(0, i) + path.substring(j + 1);
        }
        if(i < path.length && path[i] != '(') {
            pos = {x : pos.x + dir[path[i]].dx, y : pos.y + dir[path[i]].dy};
            output.push(pos);
            pos = {x : pos.x + dir[path[i]].dx, y : pos.y + dir[path[i]].dy};
            output.push(pos);
        } else if(path[i] == '(') i--;
    }
}

function getDistanceMap(pos, grid) {
    var toDo = [pos];
    var visited = [pos];
    pos.dist = 0;

    var add = (current, next) => {
        if(grid[next.y][next.x] == '.' && !visited.some(pos => pos.x == next.x && pos.y == next.y)) {
            next.dist = current.dist + 1;
            toDo.push(next);
            visited.push(next);
        }
    };

    while(toDo.length > 0) {
        var current = toDo.shift();
        add(current, {x : current.x + 1, y : current.y});
        add(current, {x : current.x - 1, y : current.y});
        add(current, {x : current.x, y : current.y + 1});
        add(current, {x : current.x, y : current.y - 1});
    }

    return visited; 
}