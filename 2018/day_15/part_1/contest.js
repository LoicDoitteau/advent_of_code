fs = require("fs");

fs.readFile("./2018/day_15/part_1/input.txt", 'utf8', (err, input) => {
    var map = input.split('\n').reduce((acc1, s, y) => s.split('').reduce((acc2, c, x) => {
        if(c.charCodeAt(0) != 13) {
            if(c == 'G' || c == 'E') acc2.units.push({x, y, c, hp : 200});
            if(acc2.grid[y] == undefined) acc2.grid[y] = [];
            acc2.grid[y][x] = c;
        }
        return acc2;
    }, acc1), {grid : [], units : []});

    var ap = 3;
    var round = 0;
    var flag = true;
    while(flag) {
        setPriorityOrder(map.units);
        map.units.forEach(unit => {
            if(!map.units.some(u => u.c != unit.c)) flag = false;
            if(unit.hp > 0) {
                var targets = getTargetsInRange(unit, map);
                if(targets.length == 0) {
                    var pos = getOpenSquares(unit, map);
                    if(pos.length > 0) {
                        move(unit, pos, map);
                        targets = getTargetsInRange(unit, map);
                        if(targets.length > 0) attack(unit, targets, ap, map);
                    }
                } else {
                    attack(unit, targets, ap, map);
                }
            }
        });       
        if(flag) round++;
    }

    var r = round * map.units.reduce((acc, u) => u.hp + acc, 0);
    console.log(r, round, map.units.reduce((acc, u) => u.hp + acc, 0));
});

function setPriorityOrder(positions) {
    positions.sort((p1, p2) => {
        if(p1.y < p2.y) return -1;
        if(p1.y > p2.y) return 1;
        if(p1.x < p2.x) return -1;
        if(p1.x > p2.x) return 1;
        return 0;
    });
}

function getOpenSquares(unit, map) {
    return map.units.filter(u => u.c != unit.c).reduce((acc, t) => {
        if(map.grid[t.y][t.x - 1] == '.') acc.push({x : t.x - 1 , y : t.y});
        if(map.grid[t.y][t.x + 1] == '.') acc.push({x : t.x + 1 , y : t.y});
        if(map.grid[t.y - 1][t.x] == '.') acc.push({x : t.x , y : t.y - 1});
        if(map.grid[t.y + 1][t.x] == '.') acc.push({x : t.x , y : t.y + 1});
        return acc;
    }, []);
}

function getTargetsInRange(unit, map) {
    return map.units.filter(u => u.c != unit.c && ((u.y == unit.y && Math.abs(u.x - unit.x) == 1) || (u.x == unit.x && Math.abs(u.y - unit.y) == 1)));
}

function getDistanceMap(pos, map) {
    var toDo = [pos];
    var visited = [pos];
    pos.dist = 0;

    var add = (current, next) => {
        if(map.grid[next.y][next.x] == '.' && !visited.some(pos => pos.x == next.x && pos.y == next.y)) {
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

function move(unit, positions, map) {
    var unitDistanceMap = getDistanceMap({x : unit.x, y : unit.y}, map);
    var nearest = unitDistanceMap
                    .filter(pos1 => positions.find(pos2 => pos1.x == pos2.x && pos1.y == pos2.y))
                    .reduce((acc, pos) => {
                        if(pos.dist < acc.dist) acc = {positions : [], dist : pos.dist};
                        if(pos.dist == acc.dist) acc.positions.push(pos);
                        return acc;
                    }, {dist : Infinity});
    if(nearest.positions != undefined) {
        setPriorityOrder(nearest.positions);
        var chosen = nearest.positions[0];
        var targetDistanceMap = getDistanceMap(chosen, map);
        var path = targetDistanceMap
                        .filter(pos => (pos.y == unit.y && Math.abs(pos.x - unit.x) == 1) || (pos.x == unit.x && Math.abs(pos.y - unit.y) == 1))
                        .reduce((acc, pos) => {
                            if(pos.dist < acc.dist) acc = {positions : [], dist : pos.dist};
                            if(pos.dist == acc.dist) acc.positions.push(pos);
                            return acc;
                        }, {dist : Infinity});
        setPriorityOrder(path.positions);
        var step = path.positions[0];
        map.grid[unit.y][unit.x] = '.';
        unit.x = step.x;
        unit.y = step.y;
        map.grid[unit.y][unit.x] = unit.c;
    } 
}

function attack(unit, targets, ap, map) {
    var potentialTargets = targets.reduce((acc, t) => {
        if(t.hp < acc.hp) acc = {targets : [], hp : t.hp};
        if(t.hp == acc.hp) acc.targets.push(t);
        return acc;
    }, {hp : Infinity});
    setPriorityOrder(potentialTargets.targets);
    var target = potentialTargets.targets[0];
    target.hp -= ap;
    if(target.hp <= 0) {
        map.grid[target.y][target.x] = '.';
        map.units = map.units.filter(u => u.hp > 0);
    }
}