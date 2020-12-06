const { group } = require("console");

fs = require("fs");
fs.readFile("./2020/day_6/input.txt", 'utf8', (err, input) => {
    
    const groups = [];

    const newGroup = () => ({ count: 0, responses: {} });

    let currentGroup = newGroup();

    input.split("\r\n").forEach(line => {
        if (line.length == 0) {
            groups.push(currentGroup);
            currentGroup = newGroup();
        } else {
            currentGroup.count++;
            line.split('').forEach(res => {
                if (!currentGroup.responses[res]) currentGroup.responses[res] = 0;
                currentGroup.responses[res]++;
            });
        }
    });

    const allAnswered = group => Object.keys(group.responses).filter(res => group.count == group.responses[res]);

    const response = groups.reduce((acc, group) => acc + allAnswered(group).length, 0);

    console.log(response);
});
