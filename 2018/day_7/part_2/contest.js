fs = require("fs");
fs.readFile("./2018/day_7/part_2/input.txt", 'utf8', (err, input) => {
    var graph = input.split('\n').reduce((acc, s) => {
        var p = /Step (.) must be finished before step (.) can begin./;
        var [, cur, next] = s.match(p);
        if(!acc[cur]) acc[cur] = {next : [], prev : [], seconds : cur.charCodeAt(0) - 4};
        acc[cur].next.push(next);
        if(!acc[next]) acc[next] = {next : [], prev : [], seconds : next.charCodeAt(0) - 4};
        acc[next].prev.push(cur);
        return acc;
    }, {});
    var toDo = Object.keys(graph).filter(k => graph[k].prev.length == 0).sort();
    var r = -1;
    while(toDo.length != 0) {
        pending = toDo.filter(k1 => graph[k1].prev.every(k2 => graph[k2].done)).slice(0, 5);
        r++;
        pending.forEach(current => {
            graph[current].seconds--;
            if(graph[current].seconds == 0) {
                graph[current].done = true;
                toDo.splice(toDo.indexOf(current), 1);
                toDo.push(...graph[current].next.filter(k => toDo.indexOf(k) == -1));
                toDo.sort();
            }
        });
    }
    console.log(r);
});