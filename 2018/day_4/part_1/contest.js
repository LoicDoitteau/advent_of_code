fs = require("fs");
fs.readFile("./2018/day_4/part_1/input.txt", 'utf8', (err, input) => {
    var logs = input.split('\n').sort((s1, s2) => {
        var p = /\[(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2})\] .*/
        return s1.match(p).slice(1).join("") < s2.match(p).slice(1).join("") ? -1 : 1;
    });
    var cur, start, stop;
    var guards = logs.reduce((acc, s) => {
        var p1 = /Guard #(\d+) begins shift/;
        var p2 = /falls asleep/;
        var p3 = /wakes up/;
        if(p1.test(s)) {
            var p = /\[\d{4}-\d{2}-\d{2} \d{2}:\d{2}\] Guard #(\d+) begins shift/;
            cur = s.match(p)[1];
            if(!acc[cur]) acc[cur] = {id : Number(cur), time : 0, minutes : {}}; 
        } else
        if(p2.test(s)) {
            var p = /\[\d{4}-\d{2}-\d{2} \d{2}:(\d{2})\] .*/;
            start = Number(s.match(p)[1]);
        } else
        if(p3.test(s)) {
            var p = /\[\d{4}-\d{2}-\d{2} \d{2}:(\d{2})\] .*/;
            stop = Number(s.match(p)[1]);
            acc[cur].time += stop - start;
            for(var i = start; i < stop; i++) {
                if(!acc[cur].minutes[i]) acc[cur].minutes[i] = 0;
                acc[cur].minutes[i]++;
            }
        }
        return acc;
    }, {});
    var guard = Object.keys(guards).reduce((acc, k) => {
        if(guards[k].time > acc.time) acc = guards[k];
        return acc;
    }, {time : -1});
    var r = guard.id * Object.keys(guard.minutes).reduce((acc, k) => {
        if(guard.minutes[k] > acc.val) acc = {minute : k, val : guard.minutes[k]};
        return acc;
    },{val : -1 }).minute;
    console.log(r);
});