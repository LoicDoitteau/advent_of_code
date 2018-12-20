fs = require("fs");

fs.readFile("./2018/day_20/part_1/input.txt", 'utf8', (err, input) => {
    input = input.substring(1, input.length - 1);
    var pos = {x : 0, y : 0};
    var output = [];
    console.log(process(input, pos, output).length);
});

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
            var subPath = "";
            var subPaths = [];
            var m;
            for(var n = m = i + 1, k = 1; n < j; n++) {
                if(path[n] == '(') k++;
                else if(path[n] == ')') k--;
                else if(path[n] == '|' && k == 1) {
                    subPaths.push(process(path.substring(m, n), pos, output));
                    m = n + 1;
                }
            }
            subPaths.push(process(path.substring(m, j), pos, output));
            if(!subPaths.some(p => p.length == 0)) {
                subPath = subPaths.reduce((p1, p2) => p1.length > p2.length ? p1 : p2);
            }
            path = path.substring(0, i) + subPath + path.substring(j + 1);
        }
        if(path[i] == '(') i--;
    }
    return path;
}