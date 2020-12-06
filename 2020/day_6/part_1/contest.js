fs = require("fs");
fs.readFile("./2020/day_6/input.txt", 'utf8', (err, input) => {
    
    const groups = [];
    let currentGroup = new Set();

    input.split("\r\n").forEach(line => {
        if (line.length == 0) {
            groups.push(currentGroup);
            currentGroup = new Set();
        } else {
            line.split('').forEach(res => currentGroup.add(res));
        }
    });

    const response = groups.reduce((acc, group) => acc + group.size, 0);

    console.log(response);
});
