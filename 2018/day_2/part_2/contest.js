fs = require("fs");
fs.readFile("./2018/day_2/part_2/input.txt", 'utf8', (err, input) => {
    var strings = input.split('\n')
    var r = strings.map((s1, i) => {
        return strings.slice(i + 1).reduce((acc, s2) => {
            var o = {s : "", d : 0};
            for(var j = 0; j < s1.length; j++) {
                if(s1.charAt(j) == s2.charAt(j)) {
                    o.s += s1.charAt(j);
                } else {
                    o.d++;
                }
            }
            if(o.d < acc.d) acc = o;
            return acc;
        }, {d : Infinity});
    }).reduce((acc, o) => {
        return acc.d < o.d ? acc : o;
    });
    console.log(r.s);
});