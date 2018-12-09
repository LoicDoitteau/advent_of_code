fs = require("fs");
fs.readFile("./2018/day_9/part_1/input.txt", 'utf8', (err, input) => {
    var p = /(\d+) players; last marble is worth (\d+) points/;
    var [, players, last] = input.match(p).map(Number);
    var first = {prev : {}, next : {}, val : 0};
    first.prev = first;
    first.next = first;
    var current = first;
    var turn = 0;
    var scores = {};
    while(turn < last) {
        turn++;
        if(turn % 23 == 0) {
            if(scores[turn % players] == undefined) scores[turn % players] = 0;
            var toRemove = current.prev.prev.prev.prev.prev.prev.prev;
            toRemove.prev.next = toRemove.next;
            toRemove.next.prev = toRemove.prev;
            current = toRemove.next;
            scores[turn % players] += turn;
            scores[turn % players] += toRemove.val;
        } else {
            var newMarble = {prev : current.next, next : current.next.next, val : turn};
            current.next.next.prev = newMarble;
            current.next.next = newMarble;
            current = newMarble;
        }
    }
    var r = Object.keys(scores).reduce((acc, k) => Math.max(acc, scores[k]), 0);
    console.log(r);
});