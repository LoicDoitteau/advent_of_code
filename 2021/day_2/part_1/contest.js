fs = require("fs");
fs.readFile("./2021/day_2/input.txt", 'utf8', (err, input) => {
    const regex = /^(?<direction>\w+) (?<step>\d+)$/;
    const rules = input.split('\r\n').map(line => regex.exec(line).groups);
    part1(rules);
});

const directions = {
    'forward': { dy: 1, dz: 0 },
    'up': { dy: 0, dz: -1 },
    'down': { dy: 0, dz: 1 },
};

const part1 = (rules) => {
    let y = 0;
    let z = 0;

    for (const rule of rules) {
        var direction = directions[rule.direction];
        var step = Number(rule.step);
        y += direction.dy * step;
        z += direction.dz * step;
    }

    console.log(y * z);
};
